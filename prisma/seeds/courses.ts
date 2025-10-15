import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface CourseData {
  course_code: string
  course_name: string
  description: string
  full_description: string
  course_type: string
}

export async function seedCourses(prisma: PrismaClient) {
  console.log('🌱 Starting course seeding...')
  
  try {
    // Load courses data from JSON file
    const dataPath = path.join(__dirname, '../data/sutd_courses_20251013_185407.json')
    const coursesData: CourseData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`📚 Found ${coursesData.length} SUTD courses to seed`)
    
    // Clear existing courses data
    console.log('🧹 Clearing existing courses data...')
    await prisma.courses.deleteMany()
    
    // Insert courses data
    console.log('📝 Inserting courses data...')
    let courseIdCounter = 1
    
    for (const course of coursesData) {
      await prisma.courses.create({
        data: {
          course_id: courseIdCounter,
          course_code: course.course_code || '',
          course_name: course.course_name || '',
          course_desc: course.description || '',
          course_full_desc: course.full_description || '',
          ai_tagged_skill: course.course_type || 'Unknown',
        }
      })
      courseIdCounter++
    }
    
    console.log(`✅ Successfully seeded ${coursesData.length} courses`)
    
  } catch (error) {
    console.error('❌ Error during course seeding:', error)
    throw error
  }
}
