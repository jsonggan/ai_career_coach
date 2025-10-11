import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const USER_DATA_DIR = path.resolve(__dirname, '../prisma/seeds/data/user_data')

const departmentOptions = [
  "Army",
  "Navy (RSN)",
  "Air Force (RSAF)",
  "Cyber Defence",
  "Intelligence",
  "Logistics",
  "Medical",
  "Engineering",
  "Training",
  "Administration",
  "Joint Operations",
  "Special Operations",
  "DSTA",
  "DSO",
  "MINDEF HQ",
];

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment')
  }
  return new OpenAI({ apiKey })
}

async function classifyDepartment(openai, { skillSet, jobRole, name }) {
  const prompt = `Based on the following information, classify which department this person belongs to:

Name: ${name}
Job Role: ${jobRole}
Skills: ${skillSet.join(', ')}

Choose the most appropriate department from the available options based on their skills and job role.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: 'You are a military/defense organization classifier. Analyze the person\'s skills and job role to determine which department they belong to. Return only the exact department name from the provided options.' 
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'department_classification',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['department'],
          properties: {
            department: { 
              type: 'string',
              enum: departmentOptions
            }
          }
        }
      }
    }
  })

  const text = response.choices[0].message.content
  const json = JSON.parse(text)
  return json
}

async function processUserDataFiles() {
  const openai = getOpenAI()
  
  // Get all JSON files in the user_data directory
  const files = fs.readdirSync(USER_DATA_DIR).filter(file => file.endsWith('.json'))
  
  console.log(`Found ${files.length} user data files to process`)
  
  let processedCount = 0
  let errorCount = 0
  
  for (const filename of files) {
    try {
      const filePath = path.join(USER_DATA_DIR, filename)
      
      // Read existing user data
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const userData = JSON.parse(fileContent)
      
      // Skip if department already exists
      if (userData.department) {
        console.log(`⏭️  Skipping ${filename} - department already exists: ${userData.department}`)
        continue
      }
      
      // Classify department using OpenAI
      console.log(`🔍 Processing ${filename} - ${userData.name} (${userData.jobRole})`)
      
      const classification = await classifyDepartment(openai, {
        skillSet: userData.skillSet || [],
        jobRole: userData.jobRole || '',
        name: userData.name || ''
      })
      
      // Add department to user data
      userData.department = classification.department
      
      // Write updated data back to file
      fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8')
      
      processedCount++
      console.log(`✅ Updated ${filename} - assigned to ${classification.department}`)
      console.log(`   Reasoning: ${classification.reasoning}`)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      errorCount++
      console.error(`❌ Error processing ${filename}:`, error.message)
    }
  }
  
  console.log(`\n📊 Processing complete:`)
  console.log(`   ✅ Successfully processed: ${processedCount} files`)
  console.log(`   ❌ Errors: ${errorCount} files`)
  console.log(`   📁 Total files: ${files.length}`)
}

async function main() {
  try {
    await processUserDataFiles()
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main() 