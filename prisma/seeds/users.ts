import { PrismaClient } from '@prisma/client'

export async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Starting users seeding...')

  try {
    // Clear existing data in correct order (dependent tables first)
    console.log('🧹 Clearing existing data...')
    await prisma.community_posts.deleteMany()
    await prisma.peer_reviews.deleteMany()
    await prisma.user_courses.deleteMany()
    await prisma.user_certificates.deleteMany()
    await prisma.user_external_courses.deleteMany()
    await prisma.user_skill.deleteMany()
    await prisma.users_specialization.deleteMany()
    await prisma.user_career_paths.deleteMany()
    await prisma.ai_insights.deleteMany()
    await prisma.study_plans.deleteMany()
    await prisma.recommended_certificate.deleteMany()
    await prisma.recommended_courses.deleteMany()
    await prisma.recommended_external_courses.deleteMany()
    await prisma.recommended_projects.deleteMany()
    await prisma.users.deleteMany()

    // Create 5 users with specific user_ids
    console.log('👤 Creating users...')

    const usersData = [
      {
        user_id: 1,
        user_name: "Andrew Ng",
        user_email: "andrew.ng@sutd.edu.sg",
        password_hash: "$2b$10$K8K8K8K8K8K8K8K8K8K8KuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8", // placeholder hash
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01')
      },
      {
        user_id: 2,
        user_name: "Bob Chen",
        user_email: "bob.chen@sutd.edu.sg",
        password_hash: "$2b$10$K8K8K8K8K8K8K8K8K8K8KuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8",
        created_at: new Date('2024-01-02'),
        updated_at: new Date('2024-01-02')
      },
      {
        user_id: 3,
        user_name: "Carol Martinez",
        user_email: "carol.martinez@sutd.edu.sg",
        password_hash: "$2b$10$K8K8K8K8K8K8K8K8K8K8KuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8",
        created_at: new Date('2024-01-03'),
        updated_at: new Date('2024-01-03')
      },
      {
        user_id: 4,
        user_name: "David Kim",
        user_email: "david.kim@sutd.edu.sg",
        password_hash: "$2b$10$K8K8K8K8K8K8K8K8K8K8KuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8",
        created_at: new Date('2024-01-04'),
        updated_at: new Date('2024-01-04')
      },
      {
        user_id: 5,
        user_name: "Eva Singh",
        user_email: "eva.singh@sutd.edu.sg",
        password_hash: "$2b$10$K8K8K8K8K8K8K8K8K8K8KuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8",
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-05')
      }
    ]

    for (const userData of usersData) {
      await prisma.users.create({
        data: userData
      })
    }

    console.log(`✅ Successfully seeded ${usersData.length} users`)

  } catch (error) {
    console.error('❌ Error during users seeding:', error)
    throw error
  }
}
