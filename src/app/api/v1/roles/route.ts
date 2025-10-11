import { NextResponse } from 'next/server'
import { createNewRole } from './controller'
import { withErrorHandling } from '@/app/api/lib/http'

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json()
  const {
    roleTitle,
    roleDescription,
    roleDescriptionAi,
    yearsOfExperience,
    department,
    skills,
    candidateEvaluationQuestions,
    roleRelatedQuestions,
  }: {
    roleTitle: string
    roleDescription: string
    roleDescriptionAi: string
    yearsOfExperience: string
    department?: string
    skills?: string[]
    candidateEvaluationQuestions?: string[]
    roleRelatedQuestions?: string[]
  } = body

  const newRoleId = await createNewRole(
    roleTitle,
    roleDescription,
    roleDescriptionAi,
    yearsOfExperience,
    department,
    skills,
    candidateEvaluationQuestions,
    roleRelatedQuestions
  )

  return NextResponse.json({
    message: "The new role was created successfully.",
    newRoleId: newRoleId
  }, { status: 200 })
})


