import { generateQuestion } from '@/app/api/v1/roles/generate-question/controller'
import { ZodError } from 'zod'

const createMock = jest.fn()

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createMock,
      },
    },
  }))
})

describe('generateQuestion', () => {
  const generateQuestionNew = generateQuestion as unknown as (
    roleTitle: string,
    roleDescription: string,
    yearsOfExperience: string,
    department?: string,
    skills?: string[]
  ) => Promise<{
    candidateEvaluationQuestions: string[]
    roleRelatedQuestions: string[]
  }>

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Valid inputs', () => {
    it('should generate both candidate evaluation and role-related questions for valid inputs', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: [
                'Describe your experience with React and TypeScript',
                'How do you approach code reviews?',
                'What is your experience with testing frameworks?'
              ],
              roleRelatedQuestions: [
                'What challenges have you faced in frontend development?',
                'How do you stay updated with new technologies?',
                'Describe a complex UI component you built'
              ]
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Frontend Engineer',
        'Build UI with React and TypeScript; backend with Node.js',
        '3',
        'Engineering',
        ['React', 'TypeScript', 'Node.js']
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [
          'Describe your experience with React and TypeScript',
          'How do you approach code reviews?',
          'What is your experience with testing frameworks?'
        ],
        roleRelatedQuestions: [
          'What challenges have you faced in frontend development?',
          'How do you stay updated with new technologies?',
          'Describe a complex UI component you built'
        ]
      })
    })

    it('should work without optional parameters', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Question 1', 'Question 2'],
              roleRelatedQuestions: ['Role Question 1', 'Role Question 2']
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Data Analyst',
        'Analyze datasets using Python and data tools',
        '2'
      )

      expect(result.candidateEvaluationQuestions).toHaveLength(2)
      expect(result.roleRelatedQuestions).toHaveLength(2)
    })

    it('should handle empty arrays from OpenAI response', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: [],
              roleRelatedQuestions: []
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop software applications',
        '1',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })
  })

  describe('ZodError validation', () => {
    it('should throw ZodError when roleTitle is empty', async () => {
      await expect(
        generateQuestionNew(
          '',
          'Work on backend services',
          '4',
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when roleTitle is missing', async () => {
      await expect(
        generateQuestionNew(
          undefined as any,
          'Work on backend services',
          '4',
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when roleDescription is empty', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          '',
          '4',
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when roleDescription is missing', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          undefined as any,
          '4',
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when yearsOfExperience is empty', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          'Work on backend services',
          '',
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when yearsOfExperience is missing', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          'Work on backend services',
          undefined as any,
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when yearsOfExperience is not a string', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          'Work on backend services',
          4 as any,
          'Engineering'
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when skills is not an array', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          'Work on backend services',
          '4',
          'Engineering',
          'React' as any
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError when skills array contains non-string elements', async () => {
      await expect(
        generateQuestionNew(
          'Backend Engineer',
          'Work on backend services',
          '4',
          'Engineering',
          ['React', 123, 'TypeScript'] as any
        )
      ).rejects.toThrow(ZodError)
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle OpenAI API failure', async () => {
      createMock.mockRejectedValueOnce(new Error('OpenAI API failure'))

      await expect(
        generateQuestionNew(
          'ML Engineer',
          'Build and deploy ML models',
          '2',
          'AI Lab',
          ['Python', 'TensorFlow']
        )
      ).rejects.toThrow('OpenAI API failure')
    })

    it('should handle malformed OpenAI response', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            content: 'Invalid JSON response'
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })

    it('should handle OpenAI response with missing parsed data', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            content: '{"someOtherField": "value"}'
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })

    it('should handle OpenAI response with partial data', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Question 1'],
              // roleRelatedQuestions missing
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result.candidateEvaluationQuestions).toEqual(['Question 1'])
      expect(result.roleRelatedQuestions).toEqual([])
    })

    it('should handle OpenAI response with non-array values', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: 'Not an array',
              roleRelatedQuestions: 123
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })

    it('should handle empty OpenAI response', async () => {
      createMock.mockResolvedValueOnce({
        choices: []
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })

    it('should handle null/undefined OpenAI response', async () => {
      createMock.mockResolvedValueOnce(null)

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: [],
        roleRelatedQuestions: []
      })
    })

    it('should filter out empty strings from questions', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Valid Question', '', 'Another Valid Question'],
              roleRelatedQuestions: ['', 'Valid Role Question', '']
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering'
      )

      expect(result).toEqual({
        candidateEvaluationQuestions: ['Valid Question', 'Another Valid Question'],
        roleRelatedQuestions: ['Valid Role Question']
      })
    })

  })

  describe('Input validation edge cases', () => {
    it('should handle very long role titles', async () => {
      const longTitle = 'A'.repeat(1000)
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Question 1'],
              roleRelatedQuestions: ['Role Question 1']
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        longTitle,
        'Work on backend services',
        '4',
        'Engineering'
      )

      expect(result.candidateEvaluationQuestions).toHaveLength(1)
      expect(result.roleRelatedQuestions).toHaveLength(1)
    })

    it('should handle special characters in inputs', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Question 1'],
              roleRelatedQuestions: ['Role Question 1']
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Engineer (Full-Stack)',
        'Work with APIs, databases & microservices',
        '5+',
        'Engineering',
        ['React', 'Node.js', 'PostgreSQL']
      )

      expect(result.candidateEvaluationQuestions).toHaveLength(1)
      expect(result.roleRelatedQuestions).toHaveLength(1)
    })

    it('should handle empty skills array', async () => {
      createMock.mockResolvedValueOnce({
        choices: [{
          message: {
            parsed: {
              candidateEvaluationQuestions: ['Question 1'],
              roleRelatedQuestions: ['Role Question 1']
            }
          }
        }],
      })

      const result = await generateQuestionNew(
        'Software Engineer',
        'Develop applications',
        '3',
        'Engineering',
        []
      )

      expect(result.candidateEvaluationQuestions).toHaveLength(1)
      expect(result.roleRelatedQuestions).toHaveLength(1)
    })
  })
})
