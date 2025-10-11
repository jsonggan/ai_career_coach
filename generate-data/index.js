import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import puppeteer from 'puppeteer'
import OpenAI from 'openai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUT_DIR = path.resolve(__dirname, '../prisma/seeds/data')
const RESUME_DIR = path.join(OUT_DIR, 'resumes')
const USER_DATA_DIR = path.join(OUT_DIR, 'user_data')

const DEPARTMENTS = [
  // 'Army', 
  // 'Navy (RSN)', 'Air Force (RSAF)', 'Cyber Defence', 
  // 'Intelligence', 
  // 'Logistics', 'Medical', 'Engineering', 'Training', 'Administration', 'Joint Operations', 'Special Operations', 
  'DSTA', 'DSO', 'MINDEF HQ']

const COUNT_PER_DEPT = 50

function ensureDirs() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(RESUME_DIR, { recursive: true })
  fs.mkdirSync(USER_DATA_DIR, { recursive: true })
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const DEFAULT_SKILLS = [
  'Leadership', 'Strategic Planning', 'Operations Management', 'Risk Assessment', 'Decision Making',
  'Communication', 'Team Building', 'Problem Solving', 'Time Management', 'Project Management',
  'Training Development', 'Stakeholder Engagement', 'Change Management', 'Process Improvement', 'Data Analysis',
  'Technical Writing', 'Presentation', 'Mentoring', 'Adaptability', 'Ethical Judgment'
]

const DEPT_SKILLS_PRESETS = {
  'Army': ['Infantry Tactics', 'Logistics Coordination', 'Mission Planning', 'Force Protection', 'Field Operations'],
  'Navy (RSN)': ['Navigation', 'Maritime Operations', 'Damage Control', 'Seamanship', 'Sensor Systems'],
  'Air Force (RSAF)': ['Flight Operations', 'Airspace Management', 'Avionics', 'Mission Planning', 'Air Defence'],
  'Cyber Defence': ['Network Security', 'Incident Response', 'Threat Hunting', 'SIEM', 'Vulnerability Management'],
  'Intelligence': ['OSINT', 'SIGINT', 'Analytical Writing', 'Briefing', 'Threat Assessment'],
  'Logistics': ['Supply Chain', 'Inventory Management', 'Procurement', 'Fleet Management', 'Demand Planning'],
  'Medical': ['Clinical Governance', 'Triage', 'Emergency Response', 'Occupational Health', 'Public Health'],
  'Engineering': ['Systems Engineering', 'Reliability', 'Maintenance Planning', 'QA/QC', 'Safety Engineering'],
  'Training': ['Curriculum Design', 'Instructional Design', 'Evaluation', 'Facilitation', 'Assessment Development'],
  'Administration': ['Policy Drafting', 'Compliance', 'Records Management', 'Vendor Management', 'Budgeting'],
  'Joint Operations': ['Inter-Agency Coordination', 'Command & Control', 'Contingency Planning', 'Wargaming', 'Doctrine'],
  'Special Operations': ['Small Unit Tactics', 'Reconnaissance', 'Mission Planning', 'Survival', 'Close Quarters Tactics'],
  'DSTA': ['Systems Integration', 'Project Governance', 'Acquisition', 'Requirements Engineering', 'Cost-Benefit Analysis'],
  'DSO': ['R&D', 'Experimentation', 'Simulation', 'Prototyping', 'Data Science'],
  'MINDEF HQ': ['Policy Analysis', 'Strategic Communications', 'Programme Management', 'Governance', 'Stakeholder Management']
}

function generateSkillsForDept(department) {
  const deptSkills = DEPT_SKILLS_PRESETS[department] || []
  const combined = [...new Set([...deptSkills, ...DEFAULT_SKILLS])]
  return combined.slice(0, 20)
}

function buildResumeHtml({ name, department, jobRole, yearsExperience, summary, skills, achievements, education, contact, experience }) {
  const achievementList = achievements.map(a => `<li>${a}</li>`).join('')
  const educationList = education.map(e => `<li><strong>${e.title}</strong> — ${e.institution} (${e.year})</li>`).join('')
  const experienceList = Array.isArray(experience) && experience.length
    ? experience.map(e => `<li><strong>${e.title}</strong> — ${e.company} <span class="muted">(${e.period})</span>${e.summary ? ` — ${e.summary}` : ''}</li>`).join('')
    : ''
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} — Resume</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; margin: 32px; color: #111827; }
    h1 { margin: 0 0 4px; font-size: 28px; }
    h2 { font-size: 14px; margin: 0 0 16px; color: #6b7280; font-weight: 600; }
    h3 { font-size: 16px; margin: 24px 0 8px; }
    .muted { color: #6b7280; }
    .section { margin-bottom: 12px; }
    ul { padding-left: 18px; margin: 6px 0; }
    .meta { display: flex; justify-content: space-between; align-items: baseline; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .chip { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 999px; padding: 4px 10px; font-size: 12px; }
    .hr { height: 1px; background: #e5e7eb; margin: 16px 0; }
  </style>
  </head>
  <body>
    <div class="meta">
      <div>
        <h1>${name}</h1>
        <h2>${jobRole} • ${department} • ${yearsExperience} yrs exp</h2>
      </div>
      <div class="muted" style="text-align:right">
        <div>${contact.email}</div>
        <div>${contact.phone}</div>
        <div>${contact.location}</div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="section">
      <h3>Professional Summary</h3>
      <p class="muted">${summary}</p>
    </div>
    <div class="section">
      <h3>Key Achievements</h3>
      <ul>${achievementList}</ul>
    </div>
    ${experienceList ? `<div class="section">\n      <h3>Past Experience</h3>\n      <ul>${experienceList}</ul>\n    </div>` : ''}
    <div class="section">
      <h3>Skills</h3>
      <div class="chips">${skills.slice(0,20).map(s => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
    <div class="section">
      <h3>Education & Certifications</h3>
      <ul>${educationList}</ul>
    </div>
  </body>
  </html>`
}

async function renderPdfFromHtml(html, outPath) {
  const browser = await puppeteer.launch({ headless: 'new' })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '16mm', right: '16mm' } })
  } finally {
    await browser.close()
  }
}

function generateTemplateJson({ userId, name, systemRole, jobRole, rank, skillSet, userDocumentId, filename, summary, achievements, education, contact, experience }) {
  // Generate realistic extracted content from the profile data
  const experienceLines = Array.isArray(experience) && experience.length ? `\n\nExperience:\n${experience.map(e => `• ${e.title} — ${e.company} (${e.period})`).join('\n')}` : ''
  const extractedContent = `${summary}\n\nKey Skills: ${skillSet.slice(0, 8).join(', ')}\n\nRecent Achievements:\n${achievements.slice(0, 3).map(a => `• ${a}`).join('\n')}${experienceLines}\n\nEducation: ${education.map(e => `${e.title} from ${e.institution} (${e.year})`).join(', ')}\n\nContact: ${contact.email} | ${contact.phone} | ${contact.location}`
  const fileName = `${userId}.pdf`
  
  return {
    userId,
    name,
    systemRole,
    jobRole,
    rank,
    skillSet,
    documents: [
      {
        userDocumentId,
        filename,
        content: fileName,
        extractedContent,
        userId,
        mimeType: "application/pdf"
      }
    ]
  }
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment')
  }
  return new OpenAI({ apiKey })
}

async function generateUserProfile(openai, { department, yearsExperience }) {
  const prompt = `Generate a realistic but fictional professional profile. Context: Singapore defence sector. Department: ${department}. YearsExperience: ${yearsExperience}. Keep it general and non-sensitive.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You generate realistic but fictional CV data and must return JSON that strictly validates against the provided schema.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'professional_profile',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'jobRole', 'rank', 'summary', 'skills', 'achievements', 'education', 'contact', 'experience'],
          properties: {
            name: { type: 'string' },
            jobRole: { type: 'string' },
            rank: { type: 'string' },
            summary: { type: 'string' },
            skills: {
              type: 'array',
              items: { type: 'string' },
              minItems: 20,
              maxItems: 40
            },
            achievements: {
              type: 'array',
              items: { type: 'string' },
              minItems: 4,
              maxItems: 10
            },
            education: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'institution', 'year'],
                properties: {
                  title: { type: 'string' },
                  institution: { type: 'string' },
                  year: { type: 'string' }
                }
              }
            },
            contact: {
              type: 'object',
              additionalProperties: false,
              required: ['email', 'phone', 'location'],
              properties: {
                email: { type: 'string' },
                phone: { type: 'string' },
                location: { type: 'string' }
              }
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'company', 'period', 'summary'],
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  period: { type: 'string' },
                  summary: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })

  const text = response.choices[0].message.content
  const json = JSON.parse(text)
  // Backfill skills with department defaults if missing
  if (!Array.isArray(json.skills) || json.skills.length < 10) {
    json.skills = generateSkillsForDept(department)
  }
  return json
}

async function main() {
  ensureDirs()

  const openai = getOpenAI()

  for (const department of DEPARTMENTS) {
    for (let i = 0; i < COUNT_PER_DEPT; i++) {
      const yearsExperience = randInt(1, 25)

      // Generate profile per user
      const profile = await generateUserProfile(openai, { department, yearsExperience })

      // Stable identifiers
      const userId = uuidv4()
      const userDocumentId = uuidv4()
      const pdfFileName = `${userId}.pdf`
      const pdfFilePath = path.join(RESUME_DIR, pdfFileName)

      // Render resume PDF
      const resumeHtml = buildResumeHtml({
        name: profile.name,
        department,
        jobRole: profile.jobRole,
        yearsExperience,
        summary: profile.summary,
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        contact: profile.contact ?? { email: '', phone: '', location: '' },
        experience: Array.isArray(profile.experience) ? profile.experience : undefined,
      })
      await renderPdfFromHtml(resumeHtml, pdfFilePath)

      // Build user_data JSON in template.json format
      const templateJson = generateTemplateJson({
        userId,
        name: profile.name,
        systemRole: 'Employee',
        jobRole: profile.jobRole,
        rank: profile.rank,
        skillSet: Array.isArray(profile.skills) ? profile.skills : generateSkillsForDept(department),
        userDocumentId,
        filename: pdfFileName,
        summary: profile.summary,
        achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        contact: profile.contact ?? { email: '', phone: '', location: '' },
        experience: Array.isArray(profile.experience) ? profile.experience : undefined,
      })

      const jsonFilePath = path.join(USER_DATA_DIR, `${userId}.json`)
      fs.writeFileSync(jsonFilePath, JSON.stringify(templateJson, null, 2), 'utf8')

      console.log(`[${department}] Generated user ${i + 1}/${COUNT_PER_DEPT}:`, {
        userId,
        yearsExperience,
        pdfFile: pdfFileName,
        jsonFile: `${userId}.json`
      })
    }
  }
}

main().catch(err => {
  console.error('Generation failed:', err)
  process.exit(1)
})


