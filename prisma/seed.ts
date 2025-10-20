import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seeds/courses'
import { seedUsers } from './seeds/users'
import { seedUserCourses } from './seeds/user-courses'
import { seedJobDescriptions } from './seeds/job-descriptions'
import { seedCertificates } from './seeds/certificates'
import { seedUserCertificates } from './seeds/user-certificates'
import { seedUserExternalCourses } from './seeds/user-external-courses'
import { seedUserProjects } from './seeds/user-projects'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  try {
    await seedUsers(prisma)
    await seedCourses(prisma)
    await seedUserCourses(prisma)
    await seedCertificates(prisma)
    await seedUserCertificates(prisma)
    await seedUserExternalCourses(prisma)
    await seedUserProjects(prisma)
    // await seedJobDescriptions(prisma)
    console.log('All seeding completed successfully')

  } catch (error) {
    console.error('Error during seeding:', error)
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
