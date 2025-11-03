import { PrismaClient } from '@prisma/client'
import { clearDatabase } from './seeds/clear-database'
import { seedCourses } from './seeds/courses'
import { seedUsers } from './seeds/users'
import { seedUserCourses } from './seeds/user-courses'
import { seedJobDescriptions } from './seeds/job-descriptions'
import { seedCertificates } from './seeds/certificates'
import { seedUserCertificates } from './seeds/user-certificates'
import { seedExternalCourses } from './seeds/external-courses'
import { seedUserExternalCourses } from './seeds/user-external-courses'
import { seedUserProjects } from './seeds/user-projects'
import { seedSpecializations, seedUserSpecializations } from './seeds/specializations'
import { seedCareerPaths, seedUserCareerPaths } from './seeds/career-paths'
import { seedPeerReviews } from './seeds/peer-reviews'
import { seedCommunityPosts } from './seeds/community-posts'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  try {
    await clearDatabase(prisma)
    await seedUsers(prisma)

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
