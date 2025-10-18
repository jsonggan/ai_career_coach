import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'
import OpenAI from 'openai'

interface JobData {
  url: string
  title: string
  company: string
  location: string
  employment_type: string
  experience_level: string
  about_us: string
  job_description: string
  job_requirements: string
  skills: string[]
}

interface JobFileData {
  query: string
  count: number
  generated_at: string
  jobs: JobData[]
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to classify skills using OpenAI API
async function classifySkillsWithOpenAI(skills: string[]): Promise<{ hardSkills: string[], softSkills: string[] }> {
  try {
    const prompt = `You are an expert in categorizing job skills. Please classify the following skills into two categories:

HARD SKILLS: Technical skills, programming languages, tools, technologies, methodologies, frameworks, and specific knowledge areas that can be measured or certified.

SOFT SKILLS: Interpersonal skills, communication abilities, personality traits, and behavioral competencies.

Skills to classify: ${skills.join(', ')}

Please respond with a JSON object in this exact format:
{
  "hardSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2", ...]
}

Only include skills that are clearly technical/hard skills in the hardSkills array, and only include interpersonal/behavioral skills in the softSkills array.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in job skill categorization. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const parsed = JSON.parse(response)
    
    return {
      hardSkills: parsed.hardSkills || [],
      softSkills: parsed.softSkills || []
    }

  } catch (error) {
    console.error('Error classifying skills with OpenAI:', error)
    
    // Fallback to simple heuristic if OpenAI fails
    console.log('Falling back to simple heuristic classification...')
    return fallbackSkillClassification(skills)
  }
}

// Fallback function for simple skill classification
function fallbackSkillClassification(skills: string[]): { hardSkills: string[], softSkills: string[] } {
  const hardSkills: string[] = []
  const softSkills: string[] = []
  
  // Simple patterns for common hard skills
  const hardSkillPatterns = [
    /javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript/i,
    /react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails/i,
    /mysql|postgresql|mongodb|redis|elasticsearch|oracle|sqlite/i,
    /aws|azure|gcp|docker|kubernetes|jenkins|gitlab|terraform/i,
    /html|css|sql|git|linux|unix|windows|api|testing|development/i,
    /machine learning|ai|artificial intelligence|data science|analytics/i,
    /blockchain|ethereum|bitcoin|solidity|web3|smart contract/i,
    /cybersecurity|security|penetration|vulnerability|encryption/i
  ]
  
  // Simple patterns for common soft skills
  const softSkillPatterns = [
    /communication|teamwork|leadership|collaboration|problem solving/i,
    /time management|project management|interpersonal|negotiation/i,
    /creativity|adaptability|critical thinking|emotional intelligence/i,
    /presentation|mentoring|coaching|facilitation|stakeholder management/i
  ]
  
  for (const skill of skills) {
    const isHardSkill = hardSkillPatterns.some(pattern => pattern.test(skill))
    const isSoftSkill = softSkillPatterns.some(pattern => pattern.test(skill))
    
    if (isHardSkill && !isSoftSkill) {
      hardSkills.push(skill)
    } else if (isSoftSkill && !isHardSkill) {
      softSkills.push(skill)
    } else {
      // Default to soft skill if ambiguous
      softSkills.push(skill)
    }
  }
  
  return { hardSkills, softSkills }
}

export async function seedJobDescriptions(prisma: PrismaClient) {
  console.log('Starting job descriptions seeding...')
  
  try {
    // Define all job files to process
    const jobFiles = [
      'jobs_sg_software_engineer_developer.json',
      'jobs_sg_cybersecurity_specialist.json',
      'jobs_sg_data_analyst_scientist.json',
      'jobs_sg_front_end.json',
      'jobs_sg_full_stack_engineer.json',
      'jobs_sg_game_designer.json',
      'jobs_sg_product_manager.json',
      'jobs_sg_research_officer_engineer.json'
    ]
    
    // Clear existing job descriptions data
    console.log('Clearing existing job descriptions data...')
    await prisma.job_description.deleteMany()
    
    let totalJobs = 0
    let jobIdCounter = 1
    
    // Process each job file
    for (const fileName of jobFiles) {
      console.log(`Processing ${fileName}...`)
      
      const dataPath = path.join(__dirname, '../data', fileName)
      const jobFileData: JobFileData = JSON.parse(readFileSync(dataPath, 'utf-8'))
      
      console.log(`Found ${jobFileData.jobs.length} jobs in ${fileName}`)
      
      // Process each job in the file
      for (const job of jobFileData.jobs) {
        console.log(`Processing job ${jobIdCounter}: ${job.title}`)
        
        // Separate skills into hard and soft skills using OpenAI
        const { hardSkills, softSkills } = await classifySkillsWithOpenAI(job.skills)
        
        console.log(`Hard skills: ${hardSkills.join(', ')}`)
        console.log(`Soft skills: ${softSkills.join(', ')}`)
        
        // Create job description entry
        await prisma.job_description.create({
          data: {
            job_id: jobIdCounter,
            job_url: job.url,
            job_title: job.title,
            job_description: job.job_description,
            job_hard_skills: hardSkills.join(', '),
            job_soft_skills: softSkills.join(', ')
          }
        })
        
        jobIdCounter++
        totalJobs++
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    console.log(`Successfully seeded ${totalJobs} job descriptions`)
    console.log(`Processed ${jobFiles.length} job files`)
    
  } catch (error) {
    console.error('Error during job descriptions seeding:', error)
    throw error
  }
}
