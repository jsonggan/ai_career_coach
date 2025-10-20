import { PrismaClient } from '@prisma/client'

/**
 * Clear all database tables in the correct order to respect foreign key constraints.
 * Child tables (with foreign keys) must be cleared before parent tables.
 */
export async function clearDatabase(prisma: PrismaClient) {
  console.log('🧹 Starting database cleanup...')

  try {
    // Clear all tables with foreign key references to users first
    console.log('🧹 Clearing user-related tables...')

    // Tables that reference users
    await prisma.ai_insights.deleteMany()
    await prisma.community_posts.deleteMany()
    await prisma.peer_reviews.deleteMany()
    await prisma.study_plan_certificate.deleteMany()
    await prisma.study_plan_courses.deleteMany()
    await prisma.study_plan_external_courses.deleteMany()
    await prisma.study_plan_projects.deleteMany()
    await prisma.study_plans.deleteMany()
    await prisma.user_career_paths.deleteMany()
    await prisma.user_certificates.deleteMany()
    await prisma.user_courses.deleteMany()
    await prisma.user_external_courses.deleteMany()
    await prisma.user_skill.deleteMany()
    await prisma.users_specialization.deleteMany()
    await prisma.recommended_certificate.deleteMany()
    await prisma.recommended_courses.deleteMany()
    await prisma.recommended_external_courses.deleteMany()
    await prisma.recommended_projects.deleteMany()

    // Clear main entity tables
    console.log('🧹 Clearing main entity tables...')
    await prisma.users.deleteMany()
    await prisma.career_paths.deleteMany()
    await prisma.specialization.deleteMany()
    await prisma.certificates.deleteMany()
    await prisma.courses.deleteMany()
    await prisma.external_courses.deleteMany()
    await prisma.projects.deleteMany()
    await prisma.skill_competencies.deleteMany()
    await prisma.job_description.deleteMany()
    await prisma.linkedin_benchmark.deleteMany()

    console.log('✅ Database cleanup completed successfully')

  } catch (error) {
    console.error('❌ Error during database cleanup:', error)
    throw error
  }
}

/**
 * Clear only user-related data (useful for partial clearing)
 */
export async function clearUserRelatedData(prisma: PrismaClient) {
  console.log('🧹 Clearing user-related data...')

  try {
    // Clear all tables with foreign key references to users
    await prisma.ai_insights.deleteMany()
    await prisma.community_posts.deleteMany()
    await prisma.peer_reviews.deleteMany()
    await prisma.study_plan_certificate.deleteMany()
    await prisma.study_plan_courses.deleteMany()
    await prisma.study_plan_external_courses.deleteMany()
    await prisma.study_plan_projects.deleteMany()
    await prisma.study_plans.deleteMany()
    await prisma.user_career_paths.deleteMany()
    await prisma.user_certificates.deleteMany()
    await prisma.user_courses.deleteMany()
    await prisma.user_external_courses.deleteMany()
    await prisma.user_skill.deleteMany()
    await prisma.users_specialization.deleteMany()
    await prisma.recommended_certificate.deleteMany()
    await prisma.recommended_courses.deleteMany()
    await prisma.recommended_external_courses.deleteMany()
    await prisma.recommended_projects.deleteMany()

    // Clear users table
    await prisma.users.deleteMany()

    console.log('✅ User-related data cleared successfully')

  } catch (error) {
    console.error('❌ Error during user-related data cleanup:', error)
    throw error
  }
}
