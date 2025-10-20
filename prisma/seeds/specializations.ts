import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface SpecializationData {
  spec_id: number
  spec_name: string
  spec_desc: string
  icon?: string
}

export async function seedSpecializations(prisma: PrismaClient) {
  console.log('🎓 Starting specializations seeding...')

  try {
    // Load specializations data from JSON file
    const dataPath = path.join(__dirname, '../data/specializations.json')
    const specializationsData: SpecializationData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`📚 Found ${specializationsData.length} specializations to seed`)

    // Note: Data clearing is handled by clearDatabase function in main seed
    // No need to clear here as it's done before all seeding starts

    // Insert specializations data
    console.log('📝 Inserting specializations data...')

    for (const spec of specializationsData) {
      await prisma.specialization.create({
        data: {
          spec_id: spec.spec_id,
          spec_name: spec.spec_name,
          spec_desc: spec.spec_desc,
          icon: spec.icon
        }
      })
    }

    console.log(`✅ Successfully seeded ${specializationsData.length} specializations`)

  } catch (error) {
    console.error('❌ Error during specializations seeding:', error)
    throw error
  }
}

export async function seedUserSpecializations(prisma: PrismaClient) {
  console.log('👤 Starting user specializations seeding...')

  try {
    const userId = 1

    // Note: User specializations clearing is handled by clearUserRelatedData function
    // No need to clear here as it's done before user seeding starts

    // Seed user specializations: Artificial Intelligence and Software Engineering
    const userSpecializations = [
      { spec_id: 1, spec_name: 'Artificial Intelligence' }, // AI
      { spec_id: 4, spec_name: 'Software Engineering' }     // Software Engineering
    ]

    console.log('🎯 Creating user specializations...')

    for (const spec of userSpecializations) {
      await prisma.users_specialization.create({
        data: {
          user_id: userId,
          spec_id: spec.spec_id,
          added_date: new Date()
        }
      })
    }

    console.log(`✅ Successfully seeded ${userSpecializations.length} user specializations for user ID ${userId}`)

  } catch (error) {
    console.error('❌ Error during user specializations seeding:', error)
    throw error
  }
}
