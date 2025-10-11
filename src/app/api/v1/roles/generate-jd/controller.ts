import OpenAI from 'openai'
import { z } from 'zod'

const InputSchema = z.object({
  roleTitle: z.string().min(1, 'role title is required'),
  roleDescription: z.string().min(1, 'role description is required'),
  yearsOfExperience: z.string().min(1, 'years of experience is required'),
  department: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

async function generateJobDescription(
  roleTitle: string,
  roleDescription: string,
  yearsOfExperience: string,
  department?: string,
  skills?: string[]
): Promise<string> {
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
            'Generate a comprehensive job description based on the provided role details. Include job title, responsibilities, requirements, and qualifications. Return only plain text without any markdown formatting, headers, bullet points, or special characters. Use simple paragraph format with line breaks between sections.',
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
          name: 'job_description',
          schema: {
            type: 'object',
            properties: {
              job_description: { type: 'string' },
            },
            required: ['job_description'],
            additionalProperties: false,
          },
        },
      },
    })

    const choice = completion?.choices?.[0]
    const message: any = choice?.message ?? {}

    // Prefer structured parsed payload: { job_description: string }
    if (message.parsed && typeof message.parsed.job_description === 'string') {
      return message.parsed.job_description
    }

    const content = message.content ?? ''

    // Try content as JSON object { job_description: "..." }
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      try {
        const parsedObj = JSON.parse(content)
        if (parsedObj && typeof parsedObj.job_description === 'string') {
          return parsedObj.job_description
        }
      } catch { }
    }

    // Fallback: return content as string
    return String(content).trim()
  } catch (err) {
    throw err
  }
}

export { generateJobDescription }