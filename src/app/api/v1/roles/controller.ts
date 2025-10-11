import { z } from 'zod'
import { prisma } from '@/db/prisma'

const InputSchema = z.object({
  roleTitle: z.string().trim().min(1, 'job title is required'),
  roleDescription: z.string().trim().min(1, 'job description is required'),
  roleDescriptionAi: z.string().trim().min(1, 'job description ai is required'),
  yearsOfExperience: z.string().trim().min(1, 'years of experience is required'),
  department: z.string().optional(),
  skills: z.array(z.string()).optional(),
  candidateEvaluationQuestions: z.array(z.string()).optional(),
  roleRelatedQuestions: z.array(z.string()).optional(),
})

async function createNewRole(
  roleTitle: string,
  roleDescriptionPrompt: string,
  roleDescriptionAi: string,
  yearsOfExperience: string,
  department?: string,
  skills?: string[],
  candidateEvaluationQuestions?: string[],
  roleRelatedQuestions?: string[],
): Promise<number> {
  const validatedData = InputSchema.parse({
    roleTitle,
    roleDescription: roleDescriptionPrompt,
    roleDescriptionAi,
    yearsOfExperience,
    department,
    skills,
    candidateEvaluationQuestions,
    roleRelatedQuestions,
  })

  const newRole = await prisma.newRole.create({
    data: {
      roleName: validatedData.roleTitle,
      descriptionPrompt: validatedData.roleDescription,
      descriptionAi: validatedData.roleDescriptionAi,
      yearOfExperience: validatedData.yearsOfExperience,
      department: validatedData.department,
      skill: validatedData.skills || [],
    },
  })

  if (validatedData.candidateEvaluationQuestions && validatedData.candidateEvaluationQuestions.length > 0) {
    await prisma.candidateEvaluation.createMany({
      data: validatedData.candidateEvaluationQuestions.map(question => ({
        candidateEvaluation: question,
        newRoleId: newRole.newRoleId,
      })),
    })
  }

  if (validatedData.roleRelatedQuestions && validatedData.roleRelatedQuestions.length > 0) {
    await prisma.roleRelatedQuestion.createMany({
      data: validatedData.roleRelatedQuestions.map(question => ({
        roleRelatedQuestion: question,
        newRoleId: newRole.newRoleId,
      })),
    })
  }

  return newRole.newRoleId
}

export { createNewRole }