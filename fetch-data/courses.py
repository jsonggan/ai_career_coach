#!/usr/bin/env python3
"""
Enhanced SUTD ISTD Course Scraper

This script comprehensively scrapes course information from SUTD's ISTD website including:
- Course listing pages (all course types: core, elective, freshmore)
- Individual course detail pages for comprehensive information
- Curriculum page for additional course references

Data collected includes:
- Course codes and names
- Detailed descriptions and learning outcomes
- Professors/instructors
- Prerequisites and requirements
- Assessment methods and grading
- Terms offered and credits
- Course types and classifications

Features:
- Multi-source data collection and merging
- Automatic URL discovery and construction
- Data completeness tracking
- Export to JSON and CSV formats
- Comprehensive error handling and logging
- Respectful scraping with delays

Usage:
    python courses.py

Output:
    - sutd_courses_TIMESTAMP.json: Detailed course data in JSON format
    - sutd_courses_TIMESTAMP.csv: Course data in CSV format for analysis
"""

import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
import time
import re
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SUTDCourseScraper:
    """Scraper for SUTD ISTD course information"""
    
    def __init__(self):
        self.base_url = "https://www.sutd.edu.sg"
        self.courses_url = "https://www.sutd.edu.sg/course/10-013-modelling-and-analysis/"
        self.course_detail_base_url = "https://www.sutd.edu.sg/course/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.courses_data = []
        
    def get_page(self, url: str, params: Optional[Dict] = None) -> Optional[BeautifulSoup]:
        """Fetch and parse a web page"""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            # Add delay to be respectful to the server
            time.sleep(1)
            
            return BeautifulSoup(response.content, 'lxml')
        except requests.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def extract_course_details(self, course_element) -> Optional[Dict]:
        """Extract detailed information from a course element"""
        try:
            course_data = {}
            
            # Extract course code and name
            title_elem = course_element.find(['h2', 'h3', 'h4'], class_=re.compile(r'course|title'))
            if not title_elem:
                title_elem = course_element.find(text=re.compile(r'50\.\d+'))
                if title_elem:
                    title_elem = title_elem.parent
            
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                # Parse course code and name
                code_match = re.match(r'(\d+\.\d+)\s+(.*)', title_text)
                if code_match:
                    course_data['code'] = code_match.group(1)
                    course_data['name'] = code_match.group(2)
                else:
                    course_data['raw_title'] = title_text
            
            # Extract professor/instructor
            prof_elem = course_element.find(text=re.compile(r'^\s*[A-Z][a-z]+\s+[A-Z][a-z]+'))
            if prof_elem:
                course_data['professor'] = prof_elem.strip()
            else:
                # Look for professor in various patterns
                prof_patterns = [
                    course_element.find(class_=re.compile(r'professor|instructor|faculty')),
                    course_element.find('p', string=re.compile(r'[A-Z][a-z]+\s+[A-Z][a-z]+')),
                ]
                for pattern in prof_patterns:
                    if pattern:
                        course_data['professor'] = pattern.get_text(strip=True)
                        break
            
            # Extract term information
            term_elem = course_element.find(text=re.compile(r'Term'))
            if term_elem:
                course_data['term'] = term_elem.strip()
            
            # Extract credits
            credits_elem = course_element.find(text=re.compile(r'\d+\s+credits?'))
            if credits_elem:
                credits_match = re.search(r'(\d+)\s+credits?', credits_elem)
                if credits_match:
                    course_data['credits'] = int(credits_match.group(1))
            
            # Extract description
            desc_elem = course_element.find(['p', 'div'], class_=re.compile(r'description|content'))
            if desc_elem:
                course_data['description'] = desc_elem.get_text(strip=True)
            else:
                # Look for description in nearby paragraphs
                paragraphs = course_element.find_all('p')
                for p in paragraphs:
                    text = p.get_text(strip=True)
                    if len(text) > 50 and not re.match(r'^(Term|Professor|Credits)', text):
                        course_data['description'] = text
                        break
            
            # Extract prerequisites
            prereq_elem = course_element.find(text=re.compile(r'Prerequisite'))
            if prereq_elem:
                prereq_text = prereq_elem.parent.get_text(strip=True) if prereq_elem.parent else prereq_elem
                course_data['prerequisites'] = prereq_text
            
            # Extract course type
            type_elem = course_element.find(class_=re.compile(r'course-type|type'))
            if type_elem:
                course_data['course_type'] = type_elem.get_text(strip=True)
            
            return course_data if course_data else None
            
        except Exception as e:
            logger.error(f"Error extracting course details: {e}")
            return None
    
    def scrape_courses_page(self, course_type: Optional[str] = None) -> tuple[List[Dict], List[str]]:
        """Scrape courses from the main courses page and discover detail URLs"""
        courses = []
        all_detail_urls = []
        
        # Define course type filters
        course_type_params = {
            'elective': {'course-type': '496'},
            'core': {'course-type': '495'},
            'freshmore_core': {'course-type': '497'},
            'freshmore_elective': {'course-type': '498'}
        }
        
        # If specific course type requested, use it; otherwise scrape all
        types_to_scrape = [course_type] if course_type else list(course_type_params.keys())
        
        for ctype in types_to_scrape:
            if ctype in course_type_params:
                params = course_type_params[ctype]
                soup = self.get_page(self.courses_url, params)
            else:
                soup = self.get_page(self.courses_url)
            
            if not soup:
                continue
            
            logger.info(f"Scraping {ctype or 'all'} courses...")
            
            # Discover course detail URLs from this page
            detail_urls = self.discover_course_detail_urls(soup)
            all_detail_urls.extend(detail_urls)
            logger.info(f"Found {len(detail_urls)} course detail URLs")
            
            # Find course containers
            course_containers = soup.find_all(['div', 'article'], class_=re.compile(r'course|item'))
            
            if not course_containers:
                # Fallback: look for any elements containing course codes
                course_containers = soup.find_all(text=re.compile(r'50\.\d+'))
                course_containers = [elem.parent for elem in course_containers if elem.parent]
            
            logger.info(f"Found {len(course_containers)} potential course elements")
            
            for container in course_containers:
                course_data = self.extract_course_details(container)
                if course_data:
                    course_data['course_type'] = ctype or 'unknown'
                    
                    # Try to construct detail URL for this course
                    if course_data.get('code') and course_data.get('name'):
                        constructed_url = self.construct_course_detail_url(
                            course_data['code'], 
                            course_data['name']
                        )
                        all_detail_urls.append(constructed_url)
                    
                    courses.append(course_data)
                    logger.info(f"Extracted: {course_data.get('code', 'Unknown')} - {course_data.get('name', 'Unknown')}")
        
        # Remove duplicate URLs
        all_detail_urls = list(set(all_detail_urls))
        
        return courses, all_detail_urls
    
    def scrape_curriculum_page(self) -> List[Dict]:
        """Scrape additional course information from curriculum page"""
        curriculum_url = "https://www.sutd.edu.sg/istd/education/undergraduate/curriculum/"
        soup = self.get_page(curriculum_url)
        
        if not soup:
            return []
        
        courses = []
        
        # Look for course codes in curriculum tables/lists
        course_codes = soup.find_all(text=re.compile(r'50\.\d{3}'))
        
        for code_elem in course_codes:
            course_data = {'code': code_elem.strip()}
            
            # Try to find associated course name
            parent = code_elem.parent
            if parent:
                # Look for course name in the same element or nearby
                full_text = parent.get_text(strip=True)
                name_match = re.search(r'50\.\d{3}\s+(.+?)(?:\n|$)', full_text)
                if name_match:
                    course_data['name'] = name_match.group(1).strip()
                
                courses.append(course_data)
        
        return courses
    
    def discover_course_detail_urls(self, soup: BeautifulSoup) -> List[str]:
        """Discover course detail page URLs from the course listing page"""
        detail_urls = []
        
        # Look for direct links to course detail pages
        course_links = soup.find_all('a', href=re.compile(r'/course/'))
        for link in course_links:
            href = link.get('href')
            if href:
                full_url = urljoin(self.base_url, href)
                detail_urls.append(full_url)
        
        return list(set(detail_urls))  # Remove duplicates
    
    def construct_course_detail_url(self, course_code: str, course_name: str) -> str:
        """Construct course detail URL from course code and name"""
        # Convert course code from "50.006" to "50-006"
        code_formatted = course_code.replace('.', '-')
        
        # Convert course name to URL format (lowercase, replace spaces with hyphens)
        name_formatted = course_name.lower()
        name_formatted = re.sub(r'[^\w\s-]', '', name_formatted)  # Remove special characters
        name_formatted = re.sub(r'\s+', '-', name_formatted)  # Replace spaces with hyphens
        name_formatted = re.sub(r'-+', '-', name_formatted)  # Replace multiple hyphens with single
        name_formatted = name_formatted.strip('-')  # Remove leading/trailing hyphens
        
        return f"{self.course_detail_base_url}{code_formatted}-{name_formatted}"
    
    def scrape_course_detail_page(self, url: str, course_code: str = None) -> Optional[Dict]:
        """Scrape detailed information from individual course page"""
        soup = self.get_page(url)
        if not soup:
            return None
        
        try:
            course_data = {}
            
            # Extract course code and title from page
            title_elem = soup.find('h1') or soup.find(['h2', 'h3'], string=re.compile(r'50\.\d+'))
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                code_match = re.search(r'(50\.\d+)', title_text)
                if code_match:
                    course_data['course_code'] = code_match.group(1)
                    # Extract name after the code
                    name_match = re.search(r'50\.\d+\s+(.+)', title_text)
                    if name_match:
                        course_data['course_name'] = name_match.group(1).strip()
            
            # Use provided course code as fallback
            if not course_data.get('course_code') and course_code:
                course_data['course_code'] = course_code
            
            # Extract detailed description
            desc_selectors = [
                'div.course-description',
                'div.description', 
                'div.content',
                'section.description',
                'div.course-content'
            ]
            
            description = ""
            for selector in desc_selectors:
                desc_elem = soup.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)
                    break
            
            # Fallback: look for paragraphs with substantial content
            if not description:
                content_divs = soup.find_all(['div', 'section', 'article'])
                for div in content_divs:
                    paragraphs = div.find_all('p')
                    if len(paragraphs) >= 2:  # Section with multiple paragraphs likely contains description
                        full_text = ' '.join([p.get_text(strip=True) for p in paragraphs])
                        if len(full_text) > 100:  # Substantial content
                            description = full_text
                            break
            
            course_data['description'] = description
            
            # Extract professor/instructor
            prof_patterns = [
                soup.find(text=re.compile(r'Instructor:|Professor:|Faculty:')),
                soup.find(class_=re.compile(r'instructor|professor|faculty', re.I)),
                soup.find('dt', string=re.compile(r'Instructor|Professor|Faculty'))
            ]
            
            for pattern in prof_patterns:
                if pattern:
                    if hasattr(pattern, 'find_next'):
                        prof_elem = pattern.find_next(['dd', 'span', 'div', 'p'])
                    else:
                        prof_elem = pattern.parent.find_next(['span', 'div', 'p'])
                    
                    if prof_elem:
                        prof_text = prof_elem.get_text(strip=True)
                        # Extract actual name (skip labels)
                        prof_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', prof_text)
                        if prof_match:
                            course_data['professor'] = prof_match.group(1)
                            break
            
            # Extract prerequisites
            prereq_patterns = [
                soup.find(text=re.compile(r'Prerequisites?:')),
                soup.find(class_=re.compile(r'prerequisite', re.I)),
                soup.find(['dt', 'strong', 'b'], string=re.compile(r'Prerequisites?', re.I))
            ]
            
            for pattern in prereq_patterns:
                if pattern:
                    if hasattr(pattern, 'find_next'):
                        prereq_elem = pattern.find_next(['dd', 'div', 'p', 'ul'])
                    else:
                        prereq_elem = pattern.parent.find_next(['div', 'p', 'ul'])
                    
                    if prereq_elem:
                        course_data['prerequisites'] = prereq_elem.get_text(strip=True)
                        break
            
            # Extract credits
            credits_patterns = [
                soup.find(text=re.compile(r'Credits?:')),
                soup.find(text=re.compile(r'\d+\s+credits?')),
                soup.find(class_=re.compile(r'credits?', re.I))
            ]
            
            for pattern in credits_patterns:
                if pattern:
                    credits_text = pattern if isinstance(pattern, str) else pattern.get_text()
                    credits_match = re.search(r'(\d+)\s*credits?', credits_text, re.I)
                    if credits_match:
                        course_data['credits'] = int(credits_match.group(1))
                        break
            
            # Extract terms offered
            term_patterns = [
                soup.find(text=re.compile(r'Terms?:')),
                soup.find(text=re.compile(r'Term \d+')),
                soup.find(class_=re.compile(r'terms?', re.I))
            ]
            
            for pattern in term_patterns:
                if pattern:
                    term_text = pattern if isinstance(pattern, str) else pattern.get_text()
                    # Extract term numbers
                    term_matches = re.findall(r'Term \d+', term_text)
                    if term_matches:
                        course_data['terms_offered'] = ', '.join(term_matches)
                        break
            
            # Extract learning outcomes
            outcomes_patterns = [
                soup.find(text=re.compile(r'Learning Outcomes?:')),
                soup.find(text=re.compile(r'Course Objectives?:')),
                soup.find(class_=re.compile(r'outcomes?|objectives?', re.I))
            ]
            
            for pattern in outcomes_patterns:
                if pattern:
                    if hasattr(pattern, 'find_next'):
                        outcomes_elem = pattern.find_next(['ul', 'ol', 'div', 'p'])
                    else:
                        outcomes_elem = pattern.parent.find_next(['ul', 'ol', 'div', 'p'])
                    
                    if outcomes_elem:
                        course_data['learning_outcomes'] = outcomes_elem.get_text(strip=True)
                        break
            
            # Extract assessment methods
            assessment_patterns = [
                soup.find(text=re.compile(r'Assessment:')),
                soup.find(text=re.compile(r'Grading:')),
                soup.find(class_=re.compile(r'assessment|grading', re.I))
            ]
            
            for pattern in assessment_patterns:
                if pattern:
                    if hasattr(pattern, 'find_next'):
                        assess_elem = pattern.find_next(['div', 'p', 'ul'])
                    else:
                        assess_elem = pattern.parent.find_next(['div', 'p', 'ul'])
                    
                    if assess_elem:
                        course_data['assessment'] = assess_elem.get_text(strip=True)
                        break
            
            # Add source URL
            course_data['detail_url'] = url
            course_data['scraped_from_detail_page'] = True
            
            return course_data
            
        except Exception as e:
            logger.error(f"Error scraping course detail page {url}: {e}")
            return None
    
    def enhance_course_data(self, courses: List[Dict]) -> List[Dict]:
        """Enhance course data with additional information"""
        enhanced_courses = []
        
        for course in courses:
            # Get course code from various possible fields
            code = (course.get('course_code') or 
                   course.get('code') or 
                   '')
            
            # Get course name from various possible fields  
            name = (course.get('course_name') or 
                   course.get('name') or 
                   '').strip()
            
            # Skip if no code or name
            if not code or not name:
                continue
                
            # Ensure course code is properly formatted
            if not re.match(r'\d+\.\d+', code):
                continue
            
            # Clean course name
            name = re.sub(r'\s+', ' ', name)  # Replace multiple spaces with single space
            
            enhanced_course = {
                'course_code': code,
                'course_name': name,
                'professor': course.get('professor', 'TBD'),
                'description': course.get('description', ''),
                'prerequisites': course.get('prerequisites', ''),
                'credits': course.get('credits', 0),
                'term': course.get('term', ''),
                'course_type': course.get('course_type', 'Unknown'),
                
                # Additional fields from detail pages
                'terms_offered': course.get('terms_offered', ''),
                'learning_outcomes': course.get('learning_outcomes', ''),
                'assessment': course.get('assessment', ''),
                'detail_url': course.get('detail_url', ''),
                'has_detail_page_data': course.get('has_detail_page_data', False),
                'scraped_from_detail_page': course.get('scraped_from_detail_page', False),
                
                # Source tracking
                'data_sources': self._get_data_sources(course)
            }
            
            enhanced_courses.append(enhanced_course)
        
        return enhanced_courses
    
    def _get_data_sources(self, course: Dict) -> List[str]:
        """Determine which sources contributed data for this course"""
        sources = []
        
        if course.get('course_type'):
            sources.append('listing_page')
        
        if course.get('scraped_from_detail_page'):
            sources.append('detail_page')
            
        if not sources:
            sources.append('curriculum_page')
            
        return sources
    
    def save_data(self, courses: List[Dict], format: str = 'both') -> None:
        """Save scraped data to file"""
        if not courses:
            logger.warning("No course data to save")
            return
        
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        
        if format in ['json', 'both']:
            json_filename = f"sutd_courses_{timestamp}.json"
            with open(json_filename, 'w', encoding='utf-8') as f:
                json.dump(courses, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(courses)} courses to {json_filename}")
        
        if format in ['csv', 'both']:
            csv_filename = f"sutd_courses_{timestamp}.csv"
            df = pd.DataFrame(courses)
            df.to_csv(csv_filename, index=False, encoding='utf-8')
            logger.info(f"Saved {len(courses)} courses to {csv_filename}")
    
    def run(self, course_type: Optional[str] = None, scrape_detail_pages: bool = True) -> List[Dict]:
        """Main method to run the scraper"""
        logger.info("Starting SUTD ISTD course scraping...")
        
        # Scrape courses from main courses page
        courses, detail_urls = self.scrape_courses_page(course_type)
        
        # Scrape additional info from curriculum page
        curriculum_courses = self.scrape_curriculum_page()
        
        # Merge listing page data
        all_courses = courses + curriculum_courses
        
        # Remove duplicates based on course code for listing data
        unique_courses = {}
        for course in all_courses:
            code = course.get('code') or course.get('course_code')
            if code:
                if code not in unique_courses:
                    unique_courses[code] = course
                else:
                    # Merge data from multiple sources
                    existing = unique_courses[code]
                    for key, value in course.items():
                        if key not in existing or not existing[key]:
                            existing[key] = value
        
        logger.info(f"Found {len(unique_courses)} unique courses from listing pages")
        
        # Scrape individual course detail pages if requested
        detailed_courses = {}
        if scrape_detail_pages and detail_urls:
            logger.info(f"Starting detailed scraping of {len(detail_urls)} course pages...")
            
            for i, url in enumerate(detail_urls, 1):
                logger.info(f"Scraping detail page {i}/{len(detail_urls)}: {url}")
                
                # Extract course code from URL for matching
                course_code_match = re.search(r'/course/(\d+-\d+)', url)
                course_code = None
                if course_code_match:
                    course_code = course_code_match.group(1).replace('-', '.')
                
                detail_data = self.scrape_course_detail_page(url, course_code)
                
                if detail_data and detail_data.get('course_code'):
                    code = detail_data['course_code']
                    detailed_courses[code] = detail_data
                    logger.info(f"Successfully scraped detail for {code}")
                elif detail_data:
                    # Store with URL as key if no course code found
                    detailed_courses[url] = detail_data
                    logger.info(f"Scraped course detail (no code found): {url}")
                else:
                    logger.warning(f"Failed to scrape detail page: {url}")
                
                # Add small delay between requests
                time.sleep(0.5)
        
        # Merge listing data with detailed data
        final_courses = {}
        
        # Start with listing page data
        for code, course in unique_courses.items():
            final_courses[code] = course.copy()
        
        # Enhance with detailed data
        for code, detail_course in detailed_courses.items():
            detail_code = detail_course.get('course_code', code)
            
            if detail_code in final_courses:
                # Merge detailed data into existing course
                existing = final_courses[detail_code]
                for key, value in detail_course.items():
                    if value and (key not in existing or not existing.get(key)):
                        existing[key] = value
                
                # Mark as enhanced with detail page data
                existing['has_detail_page_data'] = True
                logger.info(f"Enhanced {detail_code} with detail page data")
            else:
                # Add new course found only in detail pages
                final_courses[detail_code] = detail_course
                logger.info(f"Added new course from detail page: {detail_code}")
        
        # Enhance and standardize all course data
        enhanced_courses = self.enhance_course_data(list(final_courses.values()))
        
        # Save data
        self.save_data(enhanced_courses)
        
        logger.info(f"Scraping completed! Found {len(enhanced_courses)} unique courses")
        
        # Log scraping statistics
        detail_enhanced = sum(1 for course in enhanced_courses if course.get('has_detail_page_data'))
        logger.info(f"Courses enhanced with detail page data: {detail_enhanced}/{len(enhanced_courses)}")
        
        return enhanced_courses


def main():
    """Main function"""
    scraper = SUTDCourseScraper()
    
    # Scrape all course types with detail pages
    courses = scraper.run(scrape_detail_pages=True)
    
    # Print comprehensive summary
    if courses:
        print(f"\n{'='*80}")
        print(f"SUTD ISTD COURSE SCRAPING SUMMARY")
        print(f"{'='*80}")
        print(f"Total courses found: {len(courses)}")
        
        # Data source statistics
        detail_enhanced = sum(1 for course in courses if course.get('has_detail_page_data'))
        listing_only = len(courses) - detail_enhanced
        
        print(f"\nData Sources:")
        print(f"  Courses with detail page data: {detail_enhanced}")
        print(f"  Courses from listing pages only: {listing_only}")
        print(f"  Detail page enhancement rate: {detail_enhanced/len(courses)*100:.1f}%")
        
        # Course type breakdown
        type_counts = {}
        for course in courses:
            ctype = course.get('course_type', 'Unknown')
            type_counts[ctype] = type_counts.get(ctype, 0) + 1
        
        print(f"\nCourses by type:")
        for ctype, count in sorted(type_counts.items()):
            print(f"  {ctype}: {count}")
        
        # Data completeness analysis
        field_completeness = {}
        fields_to_check = ['professor', 'description', 'prerequisites', 'learning_outcomes', 'assessment']
        
        for field in fields_to_check:
            complete_count = sum(1 for course in courses if course.get(field) and course[field].strip())
            field_completeness[field] = (complete_count, complete_count/len(courses)*100)
        
        print(f"\nData Completeness:")
        for field, (count, percentage) in field_completeness.items():
            print(f"  {field}: {count}/{len(courses)} ({percentage:.1f}%)")
        
        # Show sample courses with rich data
        print(f"\nSample courses with comprehensive data:")
        rich_courses = [c for c in courses if c.get('has_detail_page_data') and c.get('description') and len(c['description']) > 50]
        
        for i, course in enumerate(rich_courses[:3], 1):
            print(f"\n{i}. {course.get('course_code', 'N/A')} - {course.get('course_name', 'N/A')}")
            print(f"   Professor: {course.get('professor', 'TBD')}")
            print(f"   Credits: {course.get('credits', 'N/A')}")
            print(f"   Terms: {course.get('terms_offered', course.get('term', 'N/A'))}")
            
            if course.get('description'):
                desc = course['description'][:150] + "..." if len(course['description']) > 150 else course['description']
                print(f"   Description: {desc}")
            
            if course.get('prerequisites'):
                prereq = course['prerequisites'][:100] + "..." if len(course['prerequisites']) > 100 else course['prerequisites']
                print(f"   Prerequisites: {prereq}")
            
            if course.get('learning_outcomes'):
                outcomes = course['learning_outcomes'][:100] + "..." if len(course['learning_outcomes']) > 100 else course['learning_outcomes']
                print(f"   Learning Outcomes: {outcomes}")
        
        # Files saved information
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        print(f"\nData saved to:")
        print(f"  - sutd_courses_{timestamp}.json")
        print(f"  - sutd_courses_{timestamp}.csv")
        
        print(f"\n{'='*80}")
        print("Scraping completed successfully!")
        print("The enhanced scraper has collected comprehensive course information")
        print("including detailed descriptions, learning outcomes, and assessment methods.")
        print(f"{'='*80}")
    
    else:
        print("No courses found. Please check the website structure or network connection.")


if __name__ == "__main__":
    main()
