import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seeds/courses'
import { seedUsers } from './seeds/users'
import { seedUserCourses } from './seeds/user-courses'
import { seedCertificates } from './seeds/certificates'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  try {
    await seedUsers(prisma)
    await seedCourses(prisma)
    await seedCertificates(prisma)
    await seedUserCourses(prisma)
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
