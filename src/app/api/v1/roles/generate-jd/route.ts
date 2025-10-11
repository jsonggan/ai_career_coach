import { NextResponse } from 'next/server'
import { generateJobDescription } from './controller'
import { withErrorHandling } from '@/app/api/lib/http'

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json()
  const {
    roleTitle,
    roleDescription,
    yearsOfExperience,
    department,
    skills,
  }: {
    roleTitle: string
    roleDescription: string
    yearsOfExperience: string
    department?: string
    skills?: string[]
  } = body

  const jobDescription = await generateJobDescription(
    roleTitle,
    roleDescription,
    yearsOfExperience,
    department,
    skills
  )

  return NextResponse.json({ job_description: jobDescription }, { status: 200 })
})


