import OpenAI from 'openai'
import { z } from 'zod'

const InputSchema = z.object({
  roleTitle: z.string().min(1, 'job title is required'),
  roleDescription: z.string().min(1, 'job description is required'),
  yearsOfExperience: z.string().min(1, 'years of experience is required'),
  department: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

async function generateQuestion(
  roleTitle: string,
  roleDescription: string,
  yearsOfExperience: string,
  department?: string,
  skills?: string[]
): Promise<{
  candidateEvaluationQuestions: string[]
  roleRelatedQuestions: string[]
}> {
  const { roleTitle: t, roleDescription: d, yearsOfExperience: y } =
    InputSchema.parse({ roleTitle, roleDescription, yearsOfExperience, department, skills })

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  const client = new OpenAI({ apiKey })

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Generate two types of questions for a job role: 1) Candidate evaluation questions to assess skills and experience, and 2) Role-related questions specific to the position. Return both as arrays of strings.',
        },
        {
          role: 'user',
          content: [
            `Title: ${t}`,
            `Department: ${department ?? 'N/A'}`,
            `Experience (years): ${y}`,
            `Description: ${d}`,
            skills && skills.length > 0 ? `Required Skills: ${skills.join(', ')}` : '',
          ].filter(Boolean).join('\n'),
        },
      ],
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'questions_payload',
          schema: {
            type: 'object',
            properties: {
              candidateEvaluationQuestions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Questions to evaluate candidate skills and experience'
              },
              roleRelatedQuestions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Questions specific to the role and its requirements'
              },
            },
            required: ['candidateEvaluationQuestions', 'roleRelatedQuestions'],
            additionalProperties: false,
          },
        },
      },
    })

    const choice = completion?.choices?.[0]
    const message: any = choice?.message ?? {}

    if (message.parsed) {
      const candidateQuestions = Array.isArray(message.parsed.candidateEvaluationQuestions)
        ? (message.parsed.candidateEvaluationQuestions as unknown[])
          .map((q) => String(q).trim())
          .filter((q) => q.length > 0)
        : []

      const roleQuestions = Array.isArray(message.parsed.roleRelatedQuestions)
        ? (message.parsed.roleRelatedQuestions as unknown[])
          .map((q) => String(q).trim())
          .filter((q) => q.length > 0)
        : []

      return {
        candidateEvaluationQuestions: candidateQuestions,
        roleRelatedQuestions: roleQuestions
      }
    }

    const content = message.content ?? ''

    if (typeof content === 'string' && content.trim().startsWith('{')) {
      try {
        const parsedObj = JSON.parse(content)
        if (parsedObj) {
          const candidateQuestions = Array.isArray(parsedObj.candidateEvaluationQuestions)
            ? parsedObj.candidateEvaluationQuestions
              .map((q: unknown) => String(q).trim())
              .filter((q: string) => q.length > 0)
            : []

          const roleQuestions = Array.isArray(parsedObj.roleRelatedQuestions)
            ? parsedObj.roleRelatedQuestions
              .map((q: unknown) => String(q).trim())
              .filter((q: string) => q.length > 0)
            : []

          return {
            candidateEvaluationQuestions: candidateQuestions,
            roleRelatedQuestions: roleQuestions
          }
        }
      } catch { }
    }

    // Fallback: return empty arrays
    return {
      candidateEvaluationQuestions: [],
      roleRelatedQuestions: []
    }
  } catch (err) {
    throw err
  }
}

export { generateQuestion }