import { NextResponse } from 'next/server'
import { generateSkillTags } from './controller'
import { withErrorHandling } from '@/app/api/lib/http'

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json()
  const {
    roleTitle,
    roleDescription,
    yearsOfExperience,
    department,
  }: {
    roleTitle: string
    roleDescription: string
    yearsOfExperience: string
    department?: string
  } = body

  const skills = await generateSkillTags(
    roleTitle,
    roleDescription,
    yearsOfExperience,
    department
  )

  return NextResponse.json({ skills }, { status: 200 })
})


