import { PrismaClient } from '@prisma/client'

export async function seedUserExternalCourses(prisma: PrismaClient) {
  console.log('📚 Starting user external courses seeding...')

  try {
    const userId = 1

    // Clear existing user external courses for user ID 1
    console.log('🧹 Clearing existing user external courses for user ID 1...')
    await prisma.user_external_courses.deleteMany({
      where: { user_id: userId }
    })

    // Clear user-added external courses
    await prisma.external_courses.deleteMany({
      where: { is_added_by_user: true }
    })

    console.log('🎓 Creating user external courses...')

    // Get the next available external_course_id
    const maxExtCourseId = await prisma.external_courses.aggregate({
      _max: { external_course_id: true }
    })
    let nextExtCourseId = (maxExtCourseId._max.external_course_id || 0) + 1

    // Get the next available user_external_course_id
    const maxUserExtCourseId = await prisma.user_external_courses.aggregate({
      _max: { user_external_course_id: true }
    })
    let nextUserExtCourseId = (maxUserExtCourseId._max.user_external_course_id || 0) + 1

    // External courses data - Full stack web development with Gen AI focus
    const externalCoursesData = [
      {
        external_course_name: 'The Complete JavaScript Course 2024: From Zero to Expert!',
        external_provider: 'Udemy',
        external_course_desc: 'Comprehensive JavaScript course covering ES6+, DOM manipulation, asynchronous programming, and modern JavaScript frameworks. Built multiple projects including a banking app and a recipe finder application.',
        external_ai_tagged_skill: 'JavaScript, DOM Manipulation, Async Programming, ES6+, Frontend Development',
        completion_date: new Date('2024-01-15')
      },
      {
        external_course_name: 'Full Stack Web Development Bootcamp',
        external_provider: 'Coursera',
        external_course_desc: 'Complete full stack development course covering React, Node.js, Express, MongoDB, and deployment. Built 5 full stack applications including a social media platform and an e-commerce site with payment integration.',
        external_ai_tagged_skill: 'React, Node.js, Express, MongoDB, Full Stack Development, REST API',
        completion_date: new Date('2024-06-20')
      },
      {
        external_course_name: 'Generative AI for Developers Specialization',
        external_provider: 'Coursera',
        external_course_desc: 'Learn to integrate OpenAI GPT, Claude, and other LLMs into web applications. Covers prompt engineering, RAG systems, vector databases, and building AI-powered features. Built 3 AI-integrated web applications.',
        external_ai_tagged_skill: 'Generative AI, OpenAI API, Prompt Engineering, RAG, Vector Databases, LLM Integration',
        completion_date: new Date('2024-09-10')
      }
    ]

    for (const courseData of externalCoursesData) {
      // Create external course
      const externalCourse = await prisma.external_courses.create({
        data: {
          external_course_id: nextExtCourseId,
          external_course_name: courseData.external_course_name,
          external_provider: courseData.external_provider,
          external_course_desc: courseData.external_course_desc,
          external_ai_tagged_skill: courseData.external_ai_tagged_skill,
          is_added_by_user: true
        }
      })

      // Create user external course link
      await prisma.user_external_courses.create({
        data: {
          user_external_course_id: nextUserExtCourseId,
          user_id: userId,
          external_course_id: externalCourse.external_course_id,
          external_course_completion_date: courseData.completion_date
        }
      })

      nextExtCourseId++
      nextUserExtCourseId++
    }

    console.log(`✅ Successfully seeded ${externalCoursesData.length} user external courses for user ID ${userId}`)

  } catch (error) {
    console.error('❌ Error during user external courses seeding:', error)
    throw error
  }
}
