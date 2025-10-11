import OpenAI from 'openai'
import { z } from 'zod'

const InputSchema = z.object({
  roleTitle: z.string().min(1, 'job title is required'),
  roleDescription: z.string().min(1, 'job description is required'),
  yearsOfExperience: z.string().min(1, 'years of experience is required'),
  department: z.string().optional(),
})

async function generateSkillTags(
  roleTitle: string,
  roleDescription: string,
  yearsOfExperience: string,
  department?: string
): Promise<string[]> {
  const { roleTitle: t, roleDescription: d, yearsOfExperience: y } =
    InputSchema.parse({ roleTitle, roleDescription, yearsOfExperience, department })

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  const client = new OpenAI({ apiKey })

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Extract a concise, comma-separated list of required technical and soft skills from the provided role details. Return only the list, no extra text.',
        },
        {
          role: 'user',
          content: [
            `Title: ${t}`,
            `Department: ${department ?? 'N/A'}`,
            `Experience (years): ${y}`,
            `Description: ${d}`,
          ].join('\n'),
        },
      ],
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'skills_payload',
          schema: {
            type: 'object',
            properties: {
              skills: { type: 'array', items: { type: 'string' } },
            },
            required: ['skills'],
            additionalProperties: false,
          },
        },
      },
    })

    const choice = completion?.choices?.[0]
    const message: any = choice?.message ?? {}

    // Prefer structured parsed payload: { skills: string[] }
    if (message.parsed && Array.isArray(message.parsed.skills)) {
      return (message.parsed.skills as unknown[])
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0)
    }

    const content = message.content ?? ''

    // Try content as JSON object { skills: [...] }
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      try {
        const parsedObj = JSON.parse(content)
        if (parsedObj && Array.isArray(parsedObj.skills)) {
          return parsedObj.skills
            .map((s: unknown) => String(s).trim())
            .filter((s: string) => s.length > 0)
        }
      } catch { }
    }

    // Try content as JSON array [..]
    if (typeof content === 'string' && content.trim().startsWith('[')) {
      try {
        const parsedArr = JSON.parse(content)
        if (Array.isArray(parsedArr)) {
          return parsedArr
            .map((s: unknown) => String(s).trim())
            .filter((s: string) => s.length > 0)
        }
      } catch { }
    }

    // Fallback: return empty array
    return []
  } catch (err) {
    throw err
  }
}

export { generateSkillTags }