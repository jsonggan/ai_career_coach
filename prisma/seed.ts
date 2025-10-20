import { PrismaClient } from '@prisma/client'
import { clearDatabase } from './seeds/clear-database'
import { seedCourses } from './seeds/courses'
import { seedUsers } from './seeds/users'
import { seedUserCourses } from './seeds/user-courses'
import { seedJobDescriptions } from './seeds/job-descriptions'
import { seedCertificates } from './seeds/certificates'
import { seedUserCertificates } from './seeds/user-certificates'
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
    // Step 1: Clear all existing data
    await clearDatabase(prisma)

    // Step 2: Seed base entities (entities without foreign key dependencies)
    console.log('📋 Seeding base entities...')
    await seedCourses(prisma)
    await seedCertificates(prisma)
    await seedSpecializations(prisma)
    await seedCareerPaths(prisma)
    // await seedJobDescriptions(prisma)

    // Step 3: Seed users (after base entities are ready)
    console.log('👥 Seeding users...')
    await seedUsers(prisma)

    // Step 4: Seed user-related junction/relationship tables
    console.log('🔗 Seeding user relationships...')
    await seedUserCourses(prisma)
    await seedUserCertificates(prisma)
    await seedUserExternalCourses(prisma)
    await seedUserProjects(prisma)
    await seedUserSpecializations(prisma)
    await seedUserCareerPaths(prisma)

    console.log('✅ All seeding completed successfully')

    await seedJobDescriptions(prisma)
    await seedPeerReviews(prisma)
    await seedCommunityPosts(prisma)
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
