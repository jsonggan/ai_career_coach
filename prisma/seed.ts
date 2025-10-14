import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface SUTDCourse {
  course_code: string
  course_name: string
  professor: string
  description: string
  full_description: string
  prerequisites: string
  credits: number
  term: string
  course_type: string
  terms_offered: string
  learning_outcomes: string
  assessment: string
  detail_url: string
  has_detail_page_data: boolean
  scraped_from_detail_page: boolean
  data_sources: string[]
}

async function main() {
  console.log('🌱 Starting seed...')

  try {
    // Read the SUTD courses JSON file
    const sutdCoursesPath = path.join(__dirname, './data/sutd_courses_20251013_185407.json')
    const sutdCoursesData: SUTDCourse[] = JSON.parse(fs.readFileSync(sutdCoursesPath, 'utf8'))

    console.log(`📚 Found ${sutdCoursesData.length} SUTD courses to seed`)

    // Clear existing courses data
    console.log('🧹 Clearing existing courses data...')
    await prisma.courses.deleteMany({})

    // Insert courses data
    console.log('📝 Inserting courses data...')
    let courseId = 1

    for (const course of sutdCoursesData) {
      await prisma.courses.create({
        data: {
          course_id: courseId++,
          course_code: course.course_code,
          course_name: course.course_name,
          course_desc: course.description,
          course_full_desc: course.full_description,
          ai_tagged_skill: course.course_type || 'Unknown', // Using course_type as ai_tagged_skill for now
        },
      })
    }

    console.log(`✅ Successfully seeded ${sutdCoursesData.length} courses`)
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
