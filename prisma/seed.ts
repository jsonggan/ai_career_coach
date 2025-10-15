import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seeds/courses'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  try {
    await seedCourses(prisma)
    console.log('✅ All seeding completed successfully')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
