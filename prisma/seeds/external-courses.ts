import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface ExternalCourseData {
  external_course_id: number
  external_course_name: string
  external_provider: string
  external_course_desc: string
  external_course_link: string | null
  external_ai_tagged_skill: string
  is_added_by_user: boolean
}

export async function seedExternalCourses(prisma: PrismaClient) {
  console.log('🌱 Starting external courses seeding...')

  try {
    // Load external courses data from JSON file
    const dataPath = path.join(__dirname, '../data/external_courses.json')
    const externalCoursesData: ExternalCourseData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`📚 Found ${externalCoursesData.length} external courses to seed`)

    // Clear existing external courses data (only non-user added courses)
    console.log('🧹 Clearing existing external courses data...')
    await prisma.external_courses.deleteMany({
      where: { is_added_by_user: false }
    })

    // Insert external courses data
    console.log('📝 Inserting external courses data...')

    for (const course of externalCoursesData) {
      await prisma.external_courses.create({
        data: {
          external_course_id: course.external_course_id,
          external_course_name: course.external_course_name,
          external_provider: course.external_provider,
          external_course_desc: course.external_course_desc,
          external_course_link: course.external_course_link,
          external_ai_tagged_skill: course.external_ai_tagged_skill,
          is_added_by_user: course.is_added_by_user,
        }
      })
    }

    console.log(`✅ Successfully seeded ${externalCoursesData.length} external courses`)

  } catch (error) {
    console.error('❌ Error during external courses seeding:', error)
    throw error
  }
}
