import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface CommunityPost {
  review_id: number
  user_id: number
  course_id: number
  course_rating?: number
  detailed_review?: string
  created_at?: string
}

export async function seedCommunityPosts(prisma: PrismaClient) {
  console.log('🌱 Starting community posts seeding...')

  try {
    const dataPath = path.join(__dirname, '../data/generated_course_reviews.json')
    const posts: CommunityPost[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`🧠 Found ${posts.length} community posts to seed`)

    // Data clearing is handled in users seeding

    let inserted = 0
    for (const post of posts) {
      const reviewDate = post.created_at && !isNaN(Date.parse(post.created_at))
        ? new Date(post.created_at)
        : new Date() 

      const rating = typeof post.course_rating === 'number' ? post.course_rating : 0
      const content = post.detailed_review?.trim() || 'No content provided'

      await prisma.community_posts.create({
        data: {
          post_id: post.review_id,
          user_id: post.user_id,
          posted_on: reviewDate,
          post_content: content,
          course_rating: rating,
        },
      })
      inserted++
    }

    console.log(`✅ Successfully seeded ${inserted} community posts`)
  } catch (error) {
    console.error('❌ Error during community posts seeding:', error)
    throw error
  }
}
