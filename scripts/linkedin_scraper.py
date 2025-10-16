import os
import sys
import json
import time
import argparse
import re
from typing import Any, Dict, List, Optional, Iterable

import requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Search and extract public LinkedIn profiles via SerpAPI"
    )
    parser.add_argument(
        "--q",
        type=str,
        default='(Computer Science OR IT OR "Information Technology" OR "Data Science") (junior OR "fresh grad" OR graduate OR "entry level")',
        help="Custom search query",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="Number of profiles to return",
    )
    parser.add_argument(
        "--out",
        type=str,
        default=None,
        help="Path to save JSON output (prints to stdout if omitted)",
    )
    parser.add_argument(
        "--ai",
        action="store_true",
        help="Use OpenAI to enrich/normalize skills from profile text",
    )
    parser.add_argument(
        "--openai-model",
        type=str,
        default="gpt-4o-mini",
        help="OpenAI model to use when --ai is enabled",
    )
    parser.add_argument(
        "--search",
        type=str,
        choices=["serpapi", "google"],
        default="serpapi",
        help="Search backend: serpapi (default) or google (Custom Search API)",
    )
    parser.add_argument(
        "--benchmark",
        action="store_true",
        help="Output benchmark-ready records instead of raw profiles",
    )
    parser.add_argument(
        "--compact",
        action="store_true",
        help="When used with --benchmark, output one record per profile with skills array (no categories)",
    )
    parser.add_argument(
        "--sections",
        action="store_true",
        help="Output raw profile sections: title/headline, about, experiences, education, skills, courses, url",
    )
    parser.add_argument(
        "--jobs",
        action="store_true",
        help="Search job listings and extract job descriptions (IT/CS/DS)",
    )
    parser.add_argument(
        "--jobs-q",
        nargs="+",
        default='"software engineer" OR "software developer" OR "data analyst" OR "data scientist" OR "product manager" OR "cybersecurity specialist" OR "front-end engineer" OR "front-end designer" OR "full stack engineer" OR "game designer" OR "research officer" OR "research engineer" OR "system consultant"',
        help="Custom job search query (used when --jobs). Accepts multiple tokens without quotes.",
    )
    parser.add_argument(
        "--jobs-sites",
        type=str,
        default='linkedin,indeed,glassdoor,greenhouse,lever',
        help="Comma-separated sites to include (domains). Supported: linkedin, indeed, glassdoor, greenhouse, lever",
    )
    parser.add_argument(
        "--jobs-region",
        type=str,
        default='Singapore',
        help="Region/country filter for jobs (e.g., 'Singapore')",
    )
    parser.add_argument(
        "--jobs-literal",
        action="store_true",
        help="Use --jobs-q exactly as provided (no expansions), for precise site-limited queries",
    )
    parser.add_argument(
        "--jobs-balanced",
        action="store_true",
        help="Evenly sample jobs across predefined roles",
    )
    parser.add_argument(
        "--jobs-per-role",
        type=int,
        default=5,
        help="Number of jobs to fetch per role when --jobs-balanced is enabled",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Print debug information to stderr",
    )
    return parser.parse_args()


def _iter_dicts(obj):
    if isinstance(obj, dict):
        yield obj
        for v in obj.values():
            yield from _iter_dicts(v)
    elif isinstance(obj, list):
        for it in obj:
            yield from _iter_dicts(it)


def _first_text(data: Dict[str, Any], keys: List[str]) -> Optional[str]:
    for d in _iter_dicts(data):
        for k in keys:
            if k in d:
                v = d.get(k)
                if isinstance(v, str) and v.strip():
                    return v.strip()
                if isinstance(v, dict):
                    t = v.get("text") or v.get("summary") or v.get("content")
                    if isinstance(t, str) and t.strip():
                        return t.strip()
    return None


def _collect_list_items(data: Dict[str, Any], candidate_keys: List[str]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for d in _iter_dicts(data):
        for k in candidate_keys:
            v = d.get(k)
            if isinstance(v, list):
                for it in v:
                    if isinstance(it, dict):
                        items.append(it)
            if isinstance(v, dict):
                inner = v.get("items") or v.get("list")
                if isinstance(inner, list):
                    for it in inner:
                        if isinstance(it, dict):
                            items.append(it)
    return items


def serp_search_google(api_key: str, query: str, num: int, debug: bool = False) -> List[Dict[str, Any]]:
    params = {
        "engine": "google",
        "q": f"site:linkedin.com/in {query}",
        "num": str(max(1, min(num, 100))),
        "api_key": api_key,
        "hl": "en",
        "gl": "us",
    }
    resp = requests.get("https://serpapi.com/search.json", params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if debug:
        if data.get("error"):
            print(f"[debug] SerpAPI error: {data['error']}", file=sys.stderr)
        else:
            print(f"[debug] SerpAPI search status ok.", file=sys.stderr)
    results: List[Dict[str, Any]] = []
    for r in data.get("organic_results", []) or []:
        link = r.get("link")
        if link and "linkedin.com/in/" in link:
            results.append({
                "title": r.get("title"),
                "link": link,
                "snippet": r.get("snippet"),
            })
    return results


def google_search_jobs(api_key: str, cse_id: str, query: str, num: int, debug: bool = False) -> List[Dict[str, Any]]:
    """Search for job listings using Google CSE with job-specific queries"""
    results: List[Dict[str, Any]] = []
    remaining = max(1, min(num, 50))
    start = 1

    # Ensure Singapore hint is present
    region_hint = " Singapore" if "singapore" not in query.lower() else ""

    # Try different job site patterns
    job_patterns = [
        f'"{query}{region_hint}" jobs',
        f'"{query}{region_hint}" careers',
        f'"{query}{region_hint}" hiring',
        f'"{query}{region_hint}" position',
    ]

    for pattern in job_patterns:
        if len(results) >= num:
            break

        params = {
            "key": api_key,
            "cx": cse_id,
            "q": pattern,
            "num": min(10, remaining),
            "start": start,
            "hl": "en",
            "gl": "sg",  # bias to Singapore
            "cr": "countrySG",  # restrict country
        }

        try:
            resp = requests.get("https://www.googleapis.com/customsearch/v1", params=params, timeout=30)
            if resp.status_code >= 400:
                if debug:
                    print(f"[debug] Google CSE error {resp.status_code} for pattern: {pattern}", file=sys.stderr)
                continue

            data = resp.json() or {}
            items = data.get("items", [])

            for item in items:
                link = item.get("link", "").lower()
                # Look for job-related URLs including SG portals
                allowed_domains = [
                    "linkedin.com/jobs",
                    "sg.linkedin.com/jobs",
                    "indeed.com",
                    "indeed.com.sg",
                    "glassdoor.com",
                    "glassdoor.com.sg",
                    "greenhouse.io",
                    "lever.co",
                    "ziprecruiter.com",
                    "monster.com",
                    "mycareersfuture.gov.sg",
                    "jobsdb.com",
                    "jobstreet.com",
                    "jobstreet.com.sg",
                    "jobscentral.com.sg",
                ]
                if any(domain in link for domain in allowed_domains):
                    results.append({
                        "title": item.get("title"),
                        "link": item.get("link"),
                        "snippet": item.get("snippet", ""),
                    })
                    if len(results) >= num:
                        break

        except Exception as e:
            if debug:
                print(f"[debug] Error searching pattern '{pattern}': {e}", file=sys.stderr)

        start += 10
        remaining = num - len(results)

    return results[:num]


def google_cse_search(api_key: str, cse_id: str, query: str, num: int, debug: bool = False) -> List[Dict[str, Any]]:
    # Google Custom Search returns at most 10 results per request; paginate with start
    results: List[Dict[str, Any]] = []
    remaining = max(1, min(num, 50))  # cap to 50 to be safe
    start = 1
    while remaining > 0 and start <= 91:  # start can be 1..91 for 10/page
        page_size = min(10, remaining)
        params = {
            "key": api_key,
            "cx": cse_id,
            "q": f"site:linkedin.com/in {query}",
            "num": page_size,
            "start": start,
            "hl": "en",
            "gl": "us",
        }
        resp = requests.get("https://www.googleapis.com/customsearch/v1", params=params, timeout=30)
        if resp.status_code == 429 and debug:
            print("[debug] Google CSE rate-limited", file=sys.stderr)
        if resp.status_code >= 400:
            if debug:
                print(f"[debug] Google CSE error {resp.status_code}: {resp.text[:200]}", file=sys.stderr)
            break
        data = resp.json() or {}
        items = data.get("items") or []
        for it in items:
            link = it.get("link")
            if link and "linkedin.com/in/" in link:
                results.append({
                    "title": it.get("title"),
                    "link": link,
                    "snippet": (it.get("snippet") or it.get("title") or ""),
                })
        remaining -= len(items)
        start += 10
        if not items:
            break
    return results


def google_cse_query(api_key: str, cse_id: str, query: str, num: int, debug: bool = False) -> List[Dict[str, Any]]:
    """Single Google CSE call with the provided query, minimal processing, return items as results."""
    results: List[Dict[str, Any]] = []
    remaining = max(1, min(num, 50))
    start = 1
    while remaining > 0 and start <= 91:
        page_size = min(10, remaining)
        params = {
            "key": api_key,
            "cx": cse_id,
            "q": query,
            "num": page_size,
            "start": start,
            "hl": "en",
        }
        resp = requests.get("https://www.googleapis.com/customsearch/v1", params=params, timeout=30)
        if resp.status_code >= 400:
            if debug:
                print(f"[debug] Google CSE error {resp.status_code}: {resp.text[:200]}", file=sys.stderr)
            break
        data = resp.json() or {}
        items = data.get("items") or []
        for it in items:
            link = it.get("link")
            if not link:
                continue
            results.append({
                "title": it.get("title"),
                "link": link,
                "snippet": it.get("snippet") or "",
            })
        remaining -= len(items)
        start += 10
        if not items:
            break
    return results


def build_jobs_query(base_q: str, sites_csv: str) -> str:
    """
    Builds a focused Google CSE query for LinkedIn job listings in Singapore
    based on the given job titles.
    """
    # Only search LinkedIn job listings
    site_expr = "site:linkedin.com/jobs/view/"

    # Emphasize job titles and region
    return f'({base_q}) {site_expr} ("Singapore" OR "SG")'


def fetch_job_page_text(url: str, timeout: int = 30) -> str:
    # Light-weight fetch; many sites render HTML server-side sufficiently for text extraction
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0)"}
        resp = requests.get(url, headers=headers, timeout=timeout)
        resp.raise_for_status()
        text = resp.text
        # crude cleanup: strip tags
        text = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.IGNORECASE)
        text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.IGNORECASE)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()
    except Exception:
        return ""


def ai_extract_job(openai_api_key: str, model: str, page_text: str, timeout: int = 90) -> Dict[str, Any]:
    if not page_text:
        return {}
    system_prompt = (
        "You are an expert recruiter. Extract the COMPLETE 'About the job' section from a job posting page text. "
        "IMPORTANT: Extract the FULL, COMPLETE text of these sections - do NOT summarize or shorten them: "
        "'About Us', 'Job Description', 'Job Requirement' (or 'Requirements'). "
        "Return EVERY detail, every bullet point, every requirement exactly as written. "
        "Return a JSON object with: title, company, location, employment_type, experience_level, about_us, job_description, job_requirements, skills (array)."
    )
    user_prompt = (
        "Page Text:\n\n" + page_text[:25000] + "\n\n" +
        "Extract the COMPLETE 'About the job' section including About Us, Job Description, and Job Requirements. "
        "DO NOT SUMMARIZE - return the FULL TEXT exactly as it appears. Include all bullet points, requirements, and details. "
        "Return format strictly as JSON with all the keys specified."
    )
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
    }
    headers = {
        "Authorization": f"Bearer {openai_api_key}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"] if data.get("choices") else ""
        try:
            parsed = json.loads(content)
        except Exception:
            m = re.search(r"\{(?:.|\n)*\}", content)
            parsed = json.loads(m.group(0)) if m else {}
        if not isinstance(parsed, dict):
            return {}
        # Normalize skills array if present
        skills = parsed.get("skills") if isinstance(parsed.get("skills"), list) else []
        parsed["skills"] = [normalize_skill(str(x)) for x in skills if x]
        return parsed
    except Exception:
        return {}


def fetch_linkedin_profile(api_key: str, profile_url: str, debug: bool = False) -> Dict[str, Any]:
    params = {
        "engine": "linkedin_profile",
        "url": profile_url,
        "api_key": api_key,
    }
    try:
        resp = requests.get("https://serpapi.com/search.json", params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if debug and data.get("error"):
            print(f"[debug] Profile API error for {profile_url}: {data['error']}", file=sys.stderr)
        # Use robust finders across nested shapes
        about = _first_text(data, ["about", "summary", "bio"]) or None
        headline: Optional[str] = _first_text(data, ["headline", "title"]) or data.get("headline")
        name: Optional[str] = (
            data.get("name")
            or data.get("full_name")
            or (data.get("person") or {}).get("name")
            or _first_text(data, ["name", "full_name"])
        )
        location: Optional[str] = (
            _first_text(data, ["location", "country", "city", "region"]) or (data.get("person") or {}).get("location")
        )
        skills_field = data.get("skills")
        if isinstance(skills_field, list):
            skills = [s if isinstance(s, str) else (s.get("title") or s.get("name")) for s in skills_field]
            skills = [s for s in skills if s]
        else:
            skills = data.get("skills_list") if isinstance(data.get("skills_list"), list) else None
        # Collect experiences from multiple possible nests
        experience_sections: List[str] = []
        experiences_raw: List[Dict[str, Any]] = []
        exp_items = _collect_list_items(data, ["experience", "experiences", "positions", "work_experience", "work"])
        for e in exp_items:
            title = (e or {}).get("title") or (e or {}).get("position_title") or _first_text(e, ["title", "position_title"]) or None
            company = (e or {}).get("company") or (e or {}).get("company_name") or _first_text(e, ["company", "company_name"]) or None
            desc = (e or {}).get("description") or _first_text(e, ["description", "summary", "details"]) or None
            parts = [p for p in [title, company, desc] if p]
            if parts:
                experience_sections.append(" - ".join(parts))
            experiences_raw.append({
                "title": title,
                "company": company,
                "description": desc,
                "start_date": (e or {}).get("start_date"),
                "end_date": (e or {}).get("end_date"),
                "location": (e or {}).get("location") or _first_text(e, ["location", "region", "city"]) or None,
            })
        # Education
        education_raw: List[Dict[str, Any]] = []
        edu_items = _collect_list_items(data, ["education", "educations", "schools", "education_list", "education_history"])
        for ed in edu_items:
            education_raw.append({
                "school": (ed or {}).get("school") or (ed or {}).get("school_name") or _first_text(ed, ["school", "school_name"]),
                "degree": (ed or {}).get("degree_name") or (ed or {}).get("degree") or _first_text(ed, ["degree_name", "degree"]),
                "field": (ed or {}).get("field_of_study") or (ed or {}).get("field") or _first_text(ed, ["field_of_study", "field"]),
                "start_date": (ed or {}).get("start_date"),
                "end_date": (ed or {}).get("end_date"),
                "grade": (ed or {}).get("grade"),
                "activities": (ed or {}).get("activities_and_societies") or (ed or {}).get("activities"),
            })
        # Courses
        courses_raw: List[str] = []
        crs_items = _collect_list_items(data, ["courses", "course_list", "certifications", "licenses"])
        for c in crs_items:
            if isinstance(c, dict):
                title = c.get("title") or c.get("name") or _first_text(c, ["title", "name"]) or None
                if title:
                    courses_raw.append(title)
        return {
            "name": name,
            "headline": headline,
            "about": about,
            "skills": skills,
            "location": location,
            "experience_text": "\n".join(experience_sections) if experience_sections else None,
            "experiences": experiences_raw or None,
            "education": education_raw or None,
            "courses": courses_raw or None,
            "url": profile_url,
        }
    except Exception:
        return {"url": profile_url}


def fetch_profile_proxycurl(proxycurl_api_key: str, profile_url: str, debug: bool = False) -> Dict[str, Any]:
    # Docs: https://nubela.co/proxycurl/docs#people-api-person-profile-endpoint
    try:
        headers = {"Authorization": f"Bearer {proxycurl_api_key}"}
        params = {
            "url": profile_url,
            # minimal fields to keep latency/cost in check; default returns enough
        }
        resp = requests.get("https://nubela.co/proxycurl/api/v2/linkedin", headers=headers, params=params, timeout=30)
        if resp.status_code == 429 and debug:
            print(f"[debug] Proxycurl rate-limited for {profile_url}", file=sys.stderr)
        resp.raise_for_status()
        data = resp.json() or {}
        # Map to our schema
        name = data.get("full_name") or data.get("first_name") or None
        headline = data.get("headline") or None
        about = data.get("summary") or None
        location = data.get("country_full_name") or data.get("city") or data.get("state") or None
        skills = data.get("skills") if isinstance(data.get("skills"), list) else None
        return {
            "name": name,
            "headline": headline,
            "about": about,
            "skills": skills,
            "location": location,
            "url": profile_url,
        }
    except Exception as e:
        if debug:
            print(f"[debug] Proxycurl error for {profile_url}: {e}", file=sys.stderr)
        return {"url": profile_url}


def normalize_skill(skill: str) -> str:
    text = skill.strip()
    # collapse whitespace and title-case common formatting while preserving acronyms
    text = re.sub(r"\s+", " ", text)
    if text.isupper() and len(text) <= 5:
        return text  # likely an acronym like SQL, NLP
    return text.title()


def unique_merge_skills(*skill_lists: Iterable[Optional[Iterable[Optional[str]]]]) -> List[str]:
    seen = set()
    merged: List[str] = []
    for group in skill_lists:
        if not group:
            continue
        for s in group:
            if not s:
                continue
            norm = normalize_skill(str(s))
            key = norm.lower()
            if key and key not in seen:
                seen.add(key)
                merged.append(norm)
    return merged


def ai_extract_skills(openai_api_key: str, model: str, text: str, timeout: int = 60) -> List[str]:
    if not text or not text.strip():
        return []
    system_prompt = (
        "You are an expert HR analyst. Extract a concise, deduplicated list of skills "
        "from the provided LinkedIn-like profile text. Focus on technical skills "
        "(e.g., programming languages, frameworks, libraries, tools, data techniques) "
        "and relevant soft skills only if clearly stated. Return ONLY a JSON array of strings."
    )
    user_prompt = (
        "Text:\n\n" + text.strip() + "\n\n" +
        "Return format strictly as JSON array, e.g.: [\"Python\", \"SQL\", \"Data Visualization\"]"
    )
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
    }
    headers = {
        "Authorization": f"Bearer {openai_api_key}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"] if data.get("choices") else ""
        # try to parse strict JSON first
        try:
            parsed = json.loads(content)
            if isinstance(parsed, list):
                return [normalize_skill(str(x)) for x in parsed if x]
        except Exception:
            pass
        # fallback: extract first JSON array from text
        match = re.search(r"\[(?:.|\n)*?\]", content)
        if match:
            try:
                parsed = json.loads(match.group(0))
                if isinstance(parsed, list):
                    return [normalize_skill(str(x)) for x in parsed if x]
            except Exception:
                return []
        return []
    except Exception:
        return []


def ai_extract_profile(openai_api_key: str, model: str, context_text: str, timeout: int = 60) -> Dict[str, Any]:
    """Ask AI to extract job_title, experience_level, and skills (array) from combined context."""
    if not context_text or not context_text.strip():
        return {}
    system_prompt = (
        "You are an expert HR analyst. From the provided LinkedIn-like text, extract:\n"
        "- job_title: the concise role title shown under the name (e.g., 'Software Engineer Intern').\n"
        "- experience_level: one of [intern, junior, mid, senior, unknown], inferred from title/years/keywords.\n"
        "- skills: a concise, deduplicated array of skills (technical + explicit soft skills).\n"
        "Return ONLY a JSON object with keys: job_title, experience_level, skills."
    )
    user_prompt = (
        "Text:\n\n" + context_text.strip() + "\n\n" +
        "Return format strictly as JSON object, e.g.: {\"job_title\":\"Junior Data Analyst\",\"experience_level\":\"junior\",\"skills\":[\"Python\",\"SQL\"]}"
    )
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
    }
    headers = {
        "Authorization": f"Bearer {openai_api_key}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"] if data.get("choices") else ""
        # parse strict JSON
        try:
            parsed = json.loads(content)
        except Exception:
            m = re.search(r"\{(?:.|\n)*\}", content)
            parsed = json.loads(m.group(0)) if m else {}
        if not isinstance(parsed, dict):
            return {}
        job_title = parsed.get("job_title")
        experience_level = parsed.get("experience_level")
        skills = parsed.get("skills") if isinstance(parsed.get("skills"), list) else []
        skills = [normalize_skill(str(x)) for x in skills if x]
        return {"job_title": job_title, "experience_level": experience_level, "skills": skills}
    except Exception:
        return {}


def infer_experience_level(text: str) -> Optional[str]:
    t = (text or "").lower()
    if any(k in t for k in ["intern", "internship", "trainee"]):
        return "intern"
    if any(k in t for k in ["entry level", "entry-level", "fresh grad", "freshgraduate", "fresh graduate", "graduate", "junior", "assoc", "associate"]):
        return "junior"
    if any(k in t for k in ["mid", "mid-level", "experienced", "specialist"]):
        return "mid"
    if any(k in t for k in ["senior", "lead", "principal", "staff"]):
        return "senior"
    return None


def extract_job_title_from_headline(headline: Optional[str]) -> Optional[str]:
    if not headline:
        return None
    # Common LinkedIn format: "Job Title at Company" or "Job Title | Keywords"
    parts = re.split(r"\bat\b|\||-", headline)
    if parts:
        title = parts[0].strip()
        # Keep it concise (max ~80 chars)
        return title[:80] if title else None
    return None


_CATEGORY_KEYWORDS: List[tuple] = [
    ("Programming Languages", ["python", "java", "javascript", "typescript", "c++", "c#", "go", "rust", "sql", "r ", " r", "scala", "matlab"]),
    ("Data & Analytics", ["sql", "excel", "tableau", "power bi", "pandas", "numpy", "matplotlib", "seaborn", "plotly", "data viz", "data visualization", "etl"]),
    ("Machine Learning & AI", ["machine learning", "deep learning", "pytorch", "tensorflow", "scikit", "ml", "nlp", "computer vision", "xgboost", "catboost"]),
    ("Cloud & DevOps", ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd"]),
    ("Web & Backend", ["react", "next.js", "node", "express", "django", "flask", "spring", "rest", "graphql"]),
    ("Tools", ["git", "github", "jira", "confluence", "linux", "bash", "vim"]),
    ("Soft Skills", ["communication", "teamwork", "leadership", "problem solving", "critical thinking", "collaboration"]),
]


def categorize_skill_heuristic(skill: str) -> str:
    s = skill.lower()
    for category, keywords in _CATEGORY_KEYWORDS:
        for kw in keywords:
            if kw in s:
                return category
    return "Other"


def ai_categorize_skill(openai_api_key: str, model: str, skill: str, timeout: int = 30) -> Optional[str]:
    try:
        system_prompt = (
            "Categorize the given skill into one high-level category from this set: "
            "[Programming Languages, Data & Analytics, Machine Learning & AI, Cloud & DevOps, Web & Backend, Tools, Soft Skills, Other]. "
            "Reply with ONLY the category name."
        )
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Skill: {skill}"},
            ],
            "temperature": 0,
        }
        headers = {
            "Authorization": f"Bearer {openai_api_key}",
            "Content-Type": "application/json",
        }
        resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"].strip()
        # Basic validation
        allowed = {"Programming Languages", "Data & Analytics", "Machine Learning & AI", "Cloud & DevOps", "Web & Backend", "Tools", "Soft Skills", "Other"}
        return content if content in allowed else None
    except Exception:
        return None


def to_benchmark_records(
    profiles: List[Dict[str, Any]],
    ai: bool,
    openai_api_key: Optional[str],
    model: str,
) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    for p in profiles:
        job_title = p.get("job_title_ai") or extract_job_title_from_headline(p.get("headline")) or "Unknown"
        exp = p.get("experience_level_ai") or infer_experience_level(" ".join([p.get("headline") or "", p.get("about") or ""])) or "unknown"
        region = (p.get("location") or "").strip()
        skills = p.get("skills") or []
        for s in skills:
            category = categorize_skill_heuristic(s)
            if ai and openai_api_key:
                cat_ai = ai_categorize_skill(openai_api_key, model, s)
                if cat_ai:
                    category = cat_ai
            records.append({
                # Required mapping for your benchmark table schema
                "job_title": job_title,
                "experience_level": exp,
                "region": region,
                "skill_name": s,
                "skill_category": category,
                "url": p.get("url"),
            })
    return records


DEFAULT_ROLES: List[str] = [
    "software engineer",
    "software developer",
    "data analyst",
    "data scientist",
    "product manager",
    "cybersecurity specialist",
    "front-end engineer",
    "front-end designer",
    "full stack engineer",
    "game designer",
    "research officer",
    "research engineer",
    "system consultant",
]


def _to_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        parts = []
        for v in value:
            t = _to_text(v)
            if t:
                parts.append(t)
        return "\n".join(parts)
    if isinstance(value, dict):
        # Try common textual fields
        for k in ("text", "summary", "content", "description"):
            if k in value and isinstance(value[k], str):
                return value[k]
        # Fallback: JSON string
        try:
            return json.dumps(value, ensure_ascii=False)
        except Exception:
            return str(value)
    return str(value)


def main() -> None:
    args = parse_args()
    # Normalize --jobs-q when provided as multiple tokens (nargs='+')
    if isinstance(getattr(args, "jobs_q", None), list):
        args.jobs_q = " ".join(args.jobs_q)
    serpapi_key = os.getenv("SERPAPI_API_KEY")
    google_api_key = os.getenv("GOOGLE_API_KEY")
    google_cse_id = os.getenv("GOOGLE_CSE_ID")

    openai_api_key = os.getenv("OPENAI_API_KEY")
    # Proxycurl is disabled per user preference; ignoring any configured key
    proxycurl_api_key = None
    if args.ai and not openai_api_key:
        print("--ai provided but OPENAI_API_KEY is missing.", file=sys.stderr)
        sys.exit(1)

    # Jobs path: run first and return early
    if args.jobs:
        if not (google_api_key and google_cse_id):
            print("Missing GOOGLE_API_KEY or GOOGLE_CSE_ID for job search.", file=sys.stderr)
            sys.exit(1)

        jobs: List[Dict[str, Any]] = []

        def discover_and_extract(q_literal: str, take: int) -> List[Dict[str, Any]]:
            found = google_cse_query(google_api_key, google_cse_id, q_literal, take * 2, debug=args.debug)
            if args.debug:
                print(f"[debug] role query: {q_literal} results={len(found)}", file=sys.stderr)
            picked = []
            for i, r in enumerate(found[:take]):
                url = r.get("link")
                if not url:
                    continue
                if i > 0:
                    time.sleep(1.0)
                page_text = fetch_job_page_text(url)
                job = {"url": url, "title": None, "company": None, "location": None, "employment_type": None, "experience_level": None, "about_us": None, "job_description": None, "job_requirements": None, "skills": []}
                if openai_api_key:
                    ai_job = ai_extract_job(openai_api_key, args.openai_model, page_text)
                    job.update({k: v for k, v in ai_job.items() if k in job})
                    # If AI extraction seems incomplete, add raw text as fallback
                    if not job.get("job_description") or len(_to_text(job.get("job_description"))) < 200:
                        job["raw_page_text"] = page_text[:5000]
                    # Fallback: ensure skills are populated
                    if not job.get("skills"):
                        combined_text_parts = [
                            _to_text(job.get("about_us")),
                            _to_text(job.get("job_description")),
                            _to_text(job.get("job_requirements")),
                        ]
                        combined_text = "\n".join([p for p in combined_text_parts if p]).strip()
                        if combined_text:
                            skills_fallback = ai_extract_skills(openai_api_key, args.openai_model, combined_text)
                            if skills_fallback:
                                job["skills"] = skills_fallback
                else:
                    job["job_description"] = page_text[:5000]
                # Singapore-only filter
                loc_txt = _to_text(job.get("location")).lower()
                page_txt_lc = page_text.lower() if isinstance(page_text, str) else ""
                if args.jobs_region:
                    want = args.jobs_region.lower()
                    if (want not in loc_txt) and (want not in page_txt_lc):
                        if args.debug:
                            print(f"[debug] skip non-{args.jobs_region}: {job.get('location')} -> {url}", file=sys.stderr)
                        continue
                jobs.append(job)
            return picked

        if args.jobs_balanced:
            roles = [r for r in DEFAULT_ROLES]
            per_role = max(1, args.jobs_per_role)
            for role in roles:
                # Strict LinkedIn SG literal query per role
                q_literal = f'({role}) site:linkedin.com/jobs/view/ ("{args.jobs_region}" OR "SG")'
                jobs.extend(discover_and_extract(q_literal, per_role))
        else:
            if args.jobs_literal:
                q = args.jobs_q
            else:
                titles_expr = args.jobs_q
                region_tokens = f'("{args.jobs_region}" OR "SG")' if args.jobs_region else ''
                q = f'({titles_expr}) {region_tokens}'.strip()
            found = google_cse_query(google_api_key, google_cse_id, q, args.limit * 2, debug=args.debug)
            if args.debug:
                print(f"[debug] jobs search_results={len(found)}", file=sys.stderr)
                print(f"[debug] jobs query: {q}", file=sys.stderr)
                for i, r in enumerate(found[:5]):
                    print(f"[debug] job[{i}]: {r.get('link')}", file=sys.stderr)
            jobs.extend(discover_and_extract_queries := discover_and_extract(q, args.limit))

        payload = {
            "query": args.jobs_q if not args.jobs_balanced else "balanced",
            "count": len(jobs),
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "jobs": jobs,
        }
        output = json.dumps(payload, indent=2, ensure_ascii=False)
        if args.out:
            with open(args.out, "w", encoding="utf-8") as f:
                f.write(output)
            print(f"Saved {len(jobs)} jobs to {args.out}")
        else:
            print(output)
        return

    if args.search == "serpapi":
        if not serpapi_key:
            print("Missing SERPAPI_API_KEY. Set it in your environment.", file=sys.stderr)
            sys.exit(1)
    else:
        if not (google_api_key and google_cse_id):
            print("Missing GOOGLE_API_KEY or GOOGLE_CSE_ID for --search google.", file=sys.stderr)
            sys.exit(1)

    if args.search == "serpapi":
        search_results = serp_search_google(serpapi_key, args.q, args.limit * 2, debug=args.debug)
    else:
        search_results = google_cse_search(google_api_key, google_cse_id, args.q, args.limit * 2, debug=args.debug)
    # de-duplicate links and trim to limit
    seen = set()
    profile_links: List[str] = []
    for r in search_results:
        link = r.get("link")
        if link and link not in seen:
            seen.add(link)
            profile_links.append(link)
        if len(profile_links) >= args.limit:
            break
    if args.debug:
        print(f"[debug] search_results={len(search_results)} profile_links={len(profile_links)}", file=sys.stderr)
        for i, u in enumerate(profile_links[:5]):
            print(f"[debug] link[{i}]: {u}", file=sys.stderr)

    results: List[Dict[str, Any]] = []
    # Build a mapping from link to search snippet/title to augment AI context
    link_to_snippet: Dict[str, str] = {r.get("link"): (r.get("snippet") or "") for r in search_results if r.get("link")}
    link_to_title: Dict[str, str] = {r.get("link"): (r.get("title") or "") for r in search_results if r.get("link")}

    for i, link in enumerate(profile_links):
        if i > 0:
            time.sleep(1.2)  # gentle pacing to respect API limits
        prof = fetch_linkedin_profile(serpapi_key or "", link, debug=args.debug)
        # No Proxycurl fallback; rely on AI over expanded text context
        # Build AI context
        text_parts = [
            prof.get("name") or "",
            prof.get("headline") or "",
            prof.get("about") or "",
            prof.get("experience_text") or "",
            link_to_title.get(link, ""),
            link_to_snippet.get(link, ""),
            f"URL: {link}",
        ]
        text_blob = "\n".join([p for p in text_parts if p]).strip()

        if args.ai:
            # Full profile extraction (title/experience_level/skills)
            ai_profile = ai_extract_profile(openai_api_key, args.openai_model, text_blob)
            if ai_profile:
                if args.debug:
                    print(f"[debug] ai_profile keys={list(ai_profile.keys())}", file=sys.stderr)
                if ai_profile.get("job_title"):
                    prof["job_title_ai"] = ai_profile["job_title"]
                if ai_profile.get("experience_level"):
                    prof["experience_level_ai"] = ai_profile["experience_level"]
                prof["skills"] = unique_merge_skills(prof.get("skills") or [], ai_profile.get("skills") or [])
            else:
                # Skills-only as fallback
                ai_skills = ai_extract_skills(openai_api_key, args.openai_model, text_blob)
                prof["skills"] = unique_merge_skills(prof.get("skills") or [], ai_skills)
            if args.debug:
                print(f"[debug] merged skills count={len(prof.get('skills') or [])}", file=sys.stderr)
        else:
            prof["skills"] = unique_merge_skills(prof.get("skills") or [])
            # Fallback: if no skills from SerpAPI and OPENAI_API_KEY is available, auto-extract
            if (not prof["skills"]) and openai_api_key:
                ai_profile = ai_extract_profile(openai_api_key, args.openai_model, text_blob)
                ai_skills = (ai_profile.get("skills") if ai_profile else None) or ai_extract_skills(openai_api_key, args.openai_model, text_blob)
                merged = unique_merge_skills(prof.get("skills") or [], ai_skills)
                if args.debug:
                    print(f"[debug] fallback ai skills={len(ai_skills)} merged={len(merged)}", file=sys.stderr)
                prof["skills"] = merged
        results.append(prof)

    if args.sections:
        # Emit raw sections per profile
        payload = {
            "query": args.q,
            "count": len(results),
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "profiles": [
                {
                    "title": p.get("headline"),
                    "about": p.get("about"),
                    "experiences": p.get("experiences"),
                    "education": p.get("education"),
                    "skills": p.get("skills"),
                    "courses": p.get("courses"),
                    "url": p.get("url"),
                }
                for p in results
            ],
        }
        output = json.dumps(payload, indent=2, ensure_ascii=False)
        if args.out:
            with open(args.out, "w", encoding="utf-8") as f:
                f.write(output)
            print(f"Saved {len(results)} profiles (sections) to {args.out}")
        else:
            print(output)
    elif args.benchmark:
        if args.compact:
            # One record per profile with array of skills
            compact: List[Dict[str, Any]] = []
            for p in results:
                compact.append({
                    "job_title": p.get("job_title_ai") or extract_job_title_from_headline(p.get("headline")) or "Unknown",
                    "experience_level": p.get("experience_level_ai") or infer_experience_level(" ".join([p.get("headline") or "", p.get("about") or ""])) or "unknown",
                    "region": (p.get("location") or "").strip(),
                    "skills": p.get("skills") or [],
                    "url": p.get("url"),
                })
            bench = compact
        else:
            bench = to_benchmark_records(results, args.ai, openai_api_key, args.openai_model)
        payload = {
            "query": args.q,
            "count": len(bench),
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "records": bench,
        }
        output = json.dumps(payload, indent=2, ensure_ascii=False)
        if args.out:
            with open(args.out, "w", encoding="utf-8") as f:
                f.write(output)
            print(f"Saved {len(bench)} benchmark records to {args.out}")
        else:
            print(output)
    else:
        payload = {
            "query": args.q,
            "count": len(results),
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "results": results,
        }
        output = json.dumps(payload, indent=2, ensure_ascii=False)
        if args.out:
            with open(args.out, "w", encoding="utf-8") as f:
                f.write(output)
            print(f"Saved {len(results)} profiles to {args.out}")
        else:
            print(output)


if __name__ == "__main__":
    main()


