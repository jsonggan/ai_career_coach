import { PrismaClient } from '@prisma/client'

export async function seedUserProjects(prisma: PrismaClient) {
  console.log('💻 Starting user projects seeding...')

  try {
    const userId = 1

    // Clear existing project associations for user ID 1
    console.log('🧹 Clearing existing project associations for user ID 1...')
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      include: { projects: true }
    })

    if (user && user.projects.length > 0) {
      await prisma.users.update({
        where: { user_id: userId },
        data: {
          projects: {
            disconnect: user.projects.map(p => ({ project_id: p.project_id }))
          }
        }
      })
    }

    console.log('🚀 Creating user projects...')

    // Get the next available project_id
    const maxProjectId = await prisma.projects.aggregate({
      _max: { project_id: true }
    })
    let nextProjectId = (maxProjectId._max.project_id || 0) + 1

    // Projects data - Full stack web development with Gen AI focus (student portfolio)
    const projectsData = [
      {
        project_title: 'Personal Portfolio Website',
        project_desc: 'Responsive personal portfolio website built with React and deployed on AWS. Features include dynamic project showcase, contact form with email integration, and dark/light mode toggle. Implemented modern CSS animations and mobile-first design principles.',
        difficulty_level: 'Beginner',
        estimated_time: '2-3 weeks',
        project_type: 'Web Application',
        technologies: 'React, CSS3, JavaScript, AWS S3, Netlify',
        skills: 'Frontend Development, Responsive Design, UI/UX, Deployment',
        project_date: new Date('2024-01-20'),
        project_link: 'https://github.com/andrewng/portfolio-website'
      },
      {
        project_title: 'Task Management App with Authentication',
        project_desc: 'Full-stack task management application with user authentication, CRUD operations, and real-time updates. Built with React frontend and Node.js/Express backend with MongoDB database. Features include task categories, due dates, and progress tracking.',
        difficulty_level: 'Intermediate',
        estimated_time: '4-5 weeks',
        project_type: 'Web Application',
        technologies: 'React, Node.js, Express, MongoDB, JWT, Socket.io',
        skills: 'Full-stack Development, Authentication, Database Design, Real-time Updates',
        project_date: new Date('2024-03-10'),
        project_link: 'https://github.com/andrewng/task-manager-app'
      },
      {
        project_title: 'AI-Powered Recipe Generator',
        project_desc: 'Web application that generates personalized recipes using OpenAI GPT-4 API based on available ingredients and dietary preferences. Features include ingredient recognition, nutritional information, and recipe saving functionality. Integrated with meal planning features.',
        difficulty_level: 'Intermediate',
        estimated_time: '5-6 weeks',
        project_type: 'Web Application',
        technologies: 'React, Node.js, OpenAI API, MongoDB, Express',
        skills: 'API Integration, Generative AI, Prompt Engineering, Full-stack Development',
        project_date: new Date('2024-05-25'),
        project_link: 'https://github.com/andrewng/ai-recipe-generator'
      },
      {
        project_title: 'Smart Study Assistant with RAG',
        project_desc: 'AI-powered study assistant that helps students with course materials using Retrieval-Augmented Generation (RAG). Upload PDFs and documents to create a personalized knowledge base. Features include smart Q&A, summary generation, and study progress tracking.',
        difficulty_level: 'Advanced',
        estimated_time: '7-8 weeks',
        project_type: 'Web Application',
        technologies: 'React, Node.js, OpenAI API, Pinecone, LangChain, PDF.js',
        skills: 'RAG Systems, Vector Databases, Document Processing, AI Integration',
        project_date: new Date('2024-08-15'),
        project_link: 'https://github.com/andrewng/smart-study-assistant'
      },
      {
        project_title: 'E-Commerce Platform with AI Recommendations',
        project_desc: 'Full-featured e-commerce web application with AI-powered product recommendations and chatbot support. Includes user authentication, shopping cart, payment processing with Stripe, and admin dashboard. AI features include personalized product suggestions and customer service chatbot.',
        difficulty_level: 'Advanced',
        estimated_time: '8-10 weeks',
        project_type: 'Web Application',
        technologies: 'React, Node.js, MongoDB, Stripe API, OpenAI API, Express, AWS S3',
        skills: 'E-commerce Development, Payment Integration, AI Recommendations, Full-stack Development',
        project_date: new Date('2024-10-20'),
        project_link: 'https://github.com/andrewng/ai-ecommerce-platform'
      },
      {
        project_title: 'Code Review Assistant with AI',
        project_desc: 'Web-based tool that analyzes code repositories and provides AI-powered code review suggestions, bug detection, and optimization recommendations. Integrates with GitHub API and uses multiple AI models to provide comprehensive code analysis and improvement suggestions.',
        difficulty_level: 'Advanced',
        estimated_time: '10-12 weeks',
        project_type: 'Web Application',
        technologies: 'React, TypeScript, Node.js, GitHub API, OpenAI API, Claude API, PostgreSQL',
        skills: 'Code Analysis, GitHub Integration, Multi-model AI, TypeScript, Advanced Full-stack',
        project_date: new Date('2024-12-05'),
        project_link: 'https://github.com/andrewng/ai-code-reviewer'
      }
    ]

    const createdProjects = []

    for (const projectData of projectsData) {
      // Create project
      const project = await prisma.projects.create({
        data: {
          project_id: nextProjectId,
          project_title: projectData.project_title,
          project_desc: projectData.project_desc,
          difficulty_level: projectData.difficulty_level,
          estimated_time: projectData.estimated_time
        }
      })

      createdProjects.push(project)
      nextProjectId++
    }

    // Connect all projects to the user
    await prisma.users.update({
      where: { user_id: userId },
      data: {
        projects: {
          connect: createdProjects.map(p => ({ project_id: p.project_id }))
        }
      }
    })

    console.log(`✅ Successfully seeded ${projectsData.length} user projects for user ID ${userId}`)

  } catch (error) {
    console.error('❌ Error during user projects seeding:', error)
    throw error
  }
}
