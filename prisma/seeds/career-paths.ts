import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface CareerPathData {
  career_id: number
  career_title: string
  career_desc: string
  icon?: string
}

export async function seedCareerPaths(prisma: PrismaClient) {
  console.log('💼 Starting career paths seeding...')

  try {
    // Load career paths data from JSON file
    const dataPath = path.join(__dirname, '../data/career_paths.json')
    const careerPathsData: CareerPathData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`📋 Found ${careerPathsData.length} career paths to seed`)

    // Note: Data clearing is handled by clearDatabase function in main seed
    // No need to clear here as it's done before all seeding starts

    // Insert career paths data
    console.log('📝 Inserting career paths data...')

    for (const career of careerPathsData) {
      await prisma.career_paths.create({
        data: {
          career_id: career.career_id,
          career_title: career.career_title,
          career_desc: career.career_desc,
          icon: career.icon
        }
      })
    }

    console.log(`✅ Successfully seeded ${careerPathsData.length} career paths`)

  } catch (error) {
    console.error('❌ Error during career paths seeding:', error)
    throw error
  }
}

export async function seedUserCareerPaths(prisma: PrismaClient) {
  console.log('👤 Starting user career paths seeding...')

  try {
    const userId = 1

    // Note: User career paths clearing is handled by clearUserRelatedData function
    // No need to clear here as it's done before user seeding starts

    // Seed user career paths: Multiple career paths per user now allowed
    const userCareerPaths = [
      { career_id: 1, career_title: 'Software Engineer/Developer' }, // Software Engineer/Developer
      { career_id: 6, career_title: 'Full Stack Engineer' }          // Full Stack Engineer
    ]

    console.log('🎯 Creating user career paths...')

    for (const career of userCareerPaths) {
      await prisma.user_career_paths.create({
        data: {
          user_id: userId,
          career_id: career.career_id
        }
      })
    }

    console.log(`✅ Successfully seeded ${userCareerPaths.length} career paths for user ID ${userId}`)

  } catch (error) {
    console.error('❌ Error during user career paths seeding:', error)
    throw error
  }
}
