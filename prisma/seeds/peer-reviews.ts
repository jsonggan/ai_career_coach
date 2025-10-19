import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface PeerReview {
  reviewer_id: number
  reviewee_id: number
  academic_performance_rating: number
  collaboration_teamwork_rating: number
  strengths_feedback: string
  areas_for_improvement: string
  additional_comments?: string
  review_date: string
}

export async function seedPeerReviews(prisma: PrismaClient) {
  console.log('🌱 Starting peer review seeding...')

  try {
    // Load peer reviews from generated JSON file
    const dataPath = path.join(__dirname, '../data/generated_peer_reviews.json')
    const peerReviews: PeerReview[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`🧠 Found ${peerReviews.length} peer reviews to seed`)

    // Data clearing is handled in users seeding

    // Insert each review
    console.log('📝 Inserting peer reviews...')
    for (const review of peerReviews) {
      await prisma.peer_reviews.create({
        data: {
          reviewer_id: review.reviewer_id,
          reviewee_id: review.reviewee_id,
          academic_performance_rating: review.academic_performance_rating,
          collaboration_teamwork_rating: review.collaboration_teamwork_rating,
          strengths_feedback: review.strengths_feedback,
          areas_for_improvement: review.areas_for_improvement,
          additional_comments: review.additional_comments || null,
          review_date: new Date(review.review_date),
        },
      })
    }

    console.log(`✅ Successfully seeded ${peerReviews.length} peer reviews`)
  } catch (error) {
    console.error('❌ Error during peer review seeding:', error)
    throw error
  }
}
