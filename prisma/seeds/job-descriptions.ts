import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface ClassifiedJobData {
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
  hard_skills: string[]
  soft_skills: string[]
}

interface ClassifiedJobFileData {
  query: string
  count: number
  generated_at: string
  classified_at: string
  jobs: ClassifiedJobData[]
}

export async function seedJobDescriptions(prisma: PrismaClient) {
  console.log('🌱 Starting job descriptions seeding...')
  
  try {
    // Define all classified job files to process
    const classifiedJobFiles = [
      'jobs_sg_software_engineer_developer_classified.json',
      'jobs_sg_cybersecurity_specialist_classified.json',
      'jobs_sg_data_analyst_scientist_classified.json',
      'jobs_sg_front_end_classified.json',
      'jobs_sg_full_stack_engineer_classified.json',
      'jobs_sg_game_designer_classified.json',
      'jobs_sg_product_manager_classified.json',
      'jobs_sg_research_officer_engineer_classified.json'
    ]
    
    // Data clearing is handled in users seeding
    
    let totalJobs = 0
    let jobIdCounter = 1
    
    // Process each classified job file
    for (const fileName of classifiedJobFiles) {
      console.log(`Processing ${fileName}...`)
      
      const dataPath = path.join(__dirname, '../data', fileName)
      
      // Check if classified file exists, if not, skip with warning
      try {
        const jobFileData: ClassifiedJobFileData = JSON.parse(readFileSync(dataPath, 'utf-8'))
        
        console.log(`Found ${jobFileData.jobs.length} classified jobs in ${fileName}`)
        console.log(`Classified at: ${jobFileData.classified_at}`)
        
        // Process each job in the file
        for (const job of jobFileData.jobs) {
          console.log(`Processing job ${jobIdCounter}: ${job.title}`)
          
          // Use pre-classified skills
          const hardSkills = job.hard_skills || []
          const softSkills = job.soft_skills || []
          
          console.log(`Hard skills: ${hardSkills.length} skills`)
          console.log(`Soft skills: ${softSkills.length} skills`)
          
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
        }
      } catch (fileError) {
        console.warn(`⚠️  Classified file ${fileName} not found. Please run 'pnpm classify:job-skills' first.`)
        console.warn(`Skipping ${fileName}...`)
        continue
      }
    }
    
    console.log(`Successfully seeded ${totalJobs} job descriptions`)
    console.log(`Processed ${classifiedJobFiles.length} classified job files`)
    
    if (totalJobs === 0) {
      console.log('\n⚠️  No jobs were seeded. Please run the skill classification script first:')
      console.log('   pnpm classify:job-skills')
    }
    
  } catch (error) {
    console.error('Error during job descriptions seeding:', error)
    throw error
  }
}
