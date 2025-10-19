import { PrismaClient } from '@prisma/client'

export async function seedUserCourses(prisma: PrismaClient) {
  console.log('📚 Starting user courses seeding...')
  
  try {
    // Data clearing is handled in users seeding
    
    // List of all courses to be taken
    const courseCodes = [
      '10.023', '10.020', '10.022', '03.007B', '10.026', '10.017', '10.018', 
      '03.007A', '10.025', '10.015', '10.013', '50.054', '50.053', '50.001', 
      '50.002', '50.004', '50.003', '50.005', '50.021', '50.012'
    ]
    
    // Find all course IDs
    console.log('🔍 Finding course IDs for all courses...')
    const courses = await prisma.courses.findMany({
      where: { 
        course_code: { 
          in: courseCodes 
        } 
      }
    })
    
    if (courses.length !== courseCodes.length) {
      const foundCodes = courses.map(c => c.course_code)
      const missingCodes = courseCodes.filter(code => !foundCodes.includes(code))
      throw new Error(`Could not find all required courses. Missing: ${missingCodes.join(', ')}. Make sure courses are seeded first.`)
    }
    
    console.log(`📖 Found ${courses.length} courses:`)
    courses.forEach(course => {
      console.log(`   - ${course.course_code}: ${course.course_name} (ID: ${course.course_id})`)
    })
    
    // Create user course records for user 1
    console.log('📝 Creating user course enrollments for user 1...')
    
    const userCoursesData = courses.map((course, index) => ({
      id: index + 1,
      user_id: 1,
      course_id: course.course_id,
      enrollment_date: new Date('2024-09-01'),
      completion_status: 'COMPLETED' as const
    }))
    
    for (const userCourse of userCoursesData) {
      await prisma.user_courses.create({
        data: userCourse
      })
    }
    
    console.log(`✅ Successfully seeded ${userCoursesData.length} user course records for user 1`)
    console.log(`   All courses marked as COMPLETED`)
    
  } catch (error) {
    console.error('❌ Error during user courses seeding:', error)
    throw error
  }
}
