import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import OpenAI from 'openai'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

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

interface ClassifiedJobData extends JobData {
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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to classify skills using OpenAI API
async function classifySkillsWithOpenAI(skills: string[]): Promise<{ hardSkills: string[], softSkills: string[] }> {
  try {
    const prompt = `You are an expert in categorizing job skills for software engineering roles. Please classify the following skills into two categories:

HARD SKILLS (Technical/Measurable):
- Programming languages (JavaScript, Python, Java, C++, Go, etc.)
- Frameworks and libraries (React, Angular, Django, Spring, etc.)
- Databases and storage (MySQL, PostgreSQL, MongoDB, Redis, etc.)
- Cloud platforms and tools (AWS, Azure, Docker, Kubernetes, etc.)
- Development tools (Git, Jenkins, CI/CD, testing frameworks, etc.)
- Operating systems (Linux, Windows, Unix, etc.)
- Blockchain technologies (Ethereum, Solidity, Web3.js, etc.)
- Data structures, algorithms, and computer science concepts
- Specific technical methodologies (TDD, BDD, Agile, Scrum, etc.)
- Technical certifications or measurable competencies

SOFT SKILLS (Behavioral/Interpersonal):
- Communication and interpersonal abilities
- Leadership and management traits
- Problem-solving approaches and mindset
- Teamwork and collaboration styles
- Time management and organizational skills
- Creativity and innovation mindset
- Adaptability and learning attitude
- Emotional intelligence and personality traits

Skills to classify: ${skills.join(', ')}

Please respond with a JSON object in this exact format:
{
  "hardSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2", ...]
}

Be very precise: if a skill is technical, measurable, or tool-specific, it's a HARD SKILL. If it's about personality, behavior, or interpersonal abilities, it's a SOFT SKILL.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in job skill categorization. Always respond with valid JSON only. Do not include any markdown formatting, code blocks, or additional text. Return only the JSON object."
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
  
  // Comprehensive patterns for hard skills (technical/measurable)
  const hardSkillPatterns = [
    // Programming languages
    /javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript|golang|f#|scala/i,
    // Frameworks and libraries
    /react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails|jquery|bootstrap|tailwind/i,
    // Databases and storage
    /mysql|postgresql|mongodb|redis|elasticsearch|oracle|sqlite|mssql|nosql|document db|cosmos db/i,
    // Cloud and infrastructure
    /aws|azure|gcp|docker|kubernetes|jenkins|gitlab|terraform|ci\/cd|devops/i,
    // Web technologies
    /html|css|sql|git|linux|unix|windows|api|rest|graphql|microservices/i,
    // AI and data
    /machine learning|artificial intelligence|data science|analytics|nlp|computer vision|deep learning|ai\b/i,
    // Blockchain
    /blockchain|ethereum|bitcoin|solidity|web3|smart contract|vyper|truffle|hardhat/i,
    // Security
    /cybersecurity|security|penetration|vulnerability|encryption|penetration testing/i,
    // Development methodologies
    /tdd|bdd|agile|scrum|kanban|test driven|behavior driven/i,
    // Technical tools and platforms
    /android|ios|mobile|ios|android development|native|cross platform|ionic/i,
    // Data structures and algorithms
    /data structures|algorithms|computer architecture|distributed systems|scalable systems/i,
    // Testing and quality
    /unit testing|integration testing|automated testing|gtest|junit|selenium|test driven|behavior driven/i,
    // Specific technologies
    /kubernetes|docker|terraform|ansible|chef|puppet|jenkins|gitlab|github/i,
    // Operating systems and platforms
    /linux|unix|windows|macos|ubuntu|centos|redhat|debian/i,
    // Networking and protocols
    /tcp\/ip|udp|http|https|websocket|mqtt|kafka|rabbitmq|activemq/i,
    // Version control and tools
    /git|svn|mercurial|bitbucket|github|gitlab|jira|confluence/i
  ]
  
  // Comprehensive patterns for soft skills (behavioral/interpersonal)
  const softSkillPatterns = [
    // Communication and interpersonal
    /communication|verbal communication|written communication|interpersonal|presentation|public speaking/i,
    // Leadership and management
    /leadership|management|team leadership|mentoring|coaching|facilitation|stakeholder management/i,
    // Collaboration and teamwork
    /teamwork|collaboration|team player|cross functional|interdisciplinary/i,
    // Problem solving and thinking
    /problem solving|critical thinking|analytical thinking|creative thinking|innovation|creativity/i,
    // Personal attributes
    /adaptability|flexibility|resilience|persistence|patience|attention to detail/i,
    // Work style and organization
    /time management|project management|organization|prioritization|multitasking|self motivated/i,
    // Learning and growth
    /continuous learning|learning agility|curiosity|growth mindset|self development/i,
    // Emotional intelligence
    /emotional intelligence|empathy|self awareness|self regulation|social awareness/i,
    // Work ethic and attitude
    /proactive|initiative|ownership|accountability|reliability|dependability/i,
    // Decision making
    /decision making|judgment|strategic thinking|business acumen|commercial awareness/i,
    // Conflict resolution
    /conflict resolution|negotiation|influence|persuasion|diplomacy/i,
    // Customer focus
    /customer focus|customer service|user experience|user centric|client facing/i
  ]
  
  for (const skill of skills) {
    const isHardSkill = hardSkillPatterns.some(pattern => pattern.test(skill))
    const isSoftSkill = softSkillPatterns.some(pattern => pattern.test(skill))
    
    if (isHardSkill && !isSoftSkill) {
      hardSkills.push(skill)
    } else if (isSoftSkill && !isHardSkill) {
      softSkills.push(skill)
    } else if (isHardSkill && isSoftSkill) {
      // If it matches both, prioritize hard skills for technical terms
      hardSkills.push(skill)
    } else {
      // Default to soft skill if ambiguous
      softSkills.push(skill)
    }
  }
  
  return { hardSkills, softSkills }
}

async function classifyAllJobSkills() {
  console.log('Starting job skills classification...')
  
  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('Please set OPENAI_API_KEY environment variable')
      process.exit(1)
    }

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
    
    let totalJobs = 0
    let processedJobs = 0
    
    // Process each job file
    for (const fileName of jobFiles) {
      console.log(`\nProcessing ${fileName}...`)
      
      const dataPath = path.join(__dirname, '../prisma/data/raw_job_description', fileName)
      const jobFileData: JobFileData = JSON.parse(readFileSync(dataPath, 'utf-8'))
      
      console.log(`Found ${jobFileData.jobs.length} jobs in ${fileName}`)
      
      const classifiedJobs: ClassifiedJobData[] = []
      
      // Process each job in the file
      for (let i = 0; i < jobFileData.jobs.length; i++) {
        const job = jobFileData.jobs[i]
        processedJobs++
        
        console.log(`Processing job ${processedJobs}/${totalJobs + jobFileData.jobs.length}: ${job.title}`)
        
        // Classify skills using OpenAI
        const { hardSkills, softSkills } = await classifySkillsWithOpenAI(job.skills)
        
        console.log(`  Hard skills: ${hardSkills.length} skills`)
        console.log(`  Soft skills: ${softSkills.length} skills`)
        
        // Create classified job data
        const classifiedJob: ClassifiedJobData = {
          ...job,
          hard_skills: hardSkills,
          soft_skills: softSkills
        }
        
        classifiedJobs.push(classifiedJob)
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Create classified file data
      const classifiedFileData: ClassifiedJobFileData = {
        query: jobFileData.query,
        count: jobFileData.count,
        generated_at: jobFileData.generated_at,
        classified_at: new Date().toISOString(),
        jobs: classifiedJobs
      }
      
      // Write classified data to new file
      const outputFileName = fileName.replace('.json', '_classified.json')
      const outputPath = path.join(__dirname, '../prisma/data', outputFileName)
      writeFileSync(outputPath, JSON.stringify(classifiedFileData, null, 2))
      
      console.log(`✅ Saved classified data to ${outputFileName}`)
      totalJobs += jobFileData.jobs.length
    }
    
    console.log(`\n🎉 Successfully classified skills for ${totalJobs} jobs across ${jobFiles.length} files`)
    console.log('Classified files saved to prisma/data/ directory')
    
  } catch (error) {
    console.error('Error during skill classification:', error)
    throw error
  }
}

// Run the script
if (require.main === module) {
  classifyAllJobSkills()
}

export { classifySkillsWithOpenAI, fallbackSkillClassification }
