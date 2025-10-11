import { createNewRole } from '@/app/api/v1/roles/controller'
import { prisma } from '@/db/prisma'

// Mock Prisma Client
jest.mock('@/db/prisma', () => ({
  prisma: {
    newRole: {
      create: jest.fn(),
    },
    roleRelatedQuestion: {
      createMany: jest.fn(),
    },
    candidateEvaluation: {
      createMany: jest.fn(),
    },
  },
}))

describe('createNewRole', () => {
  const createNewRoleNew = createNewRole as unknown as (
    jobTitle: string,
    jobDescription: string,
    jobDescriptionAi: string,
    yearsOfExperience: string,
    department?: string,
    skills?: string[],
    candidateEvaluationQuestions?: string[],
    roleRelatedQuestions?: string[],
  ) => Promise<void>

  const mockCreate = prisma.newRole.create as jest.MockedFunction<typeof prisma.newRole.create>
  const mockCreateManyRoleQuestions = prisma.roleRelatedQuestion.createMany as jest.MockedFunction<typeof prisma.roleRelatedQuestion.createMany>
  const mockCreateManyCandidateQuestions = prisma.candidateEvaluation.createMany as jest.MockedFunction<typeof prisma.candidateEvaluation.createMany>

  afterEach(() => {
    jest.clearAllMocks()
    mockCreate.mockClear()
    mockCreateManyRoleQuestions.mockClear()
    mockCreateManyCandidateQuestions.mockClear()
  })

  describe('Input Validation', () => {
    describe('Required Field Validation', () => {
      it('throws Zod error when roleTitle is empty string', async () => {
        await expect(
          createNewRoleNew(
            '',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job title is required/i)
      })

      it('throws Zod error when roleTitle is null', async () => {
        await expect(
          createNewRoleNew(
            null as any,
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleTitle is undefined', async () => {
        await expect(
          createNewRoleNew(
            undefined as any,
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescription is empty string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            '',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job description is required/i)
      })

      it('throws Zod error when roleDescription is null', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            null as any,
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescription is undefined', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            undefined as any,
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescriptionAi is empty string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            '',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job description ai is required/i)
      })

      it('throws Zod error when roleDescriptionAi is null', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            null as any,
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescriptionAi is undefined', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            undefined as any,
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when yearsOfExperience is empty string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '',
            'Engineering'
          )
        ).rejects.toThrow(/years of experience is required/i)
      })

      it('throws Zod error when yearsOfExperience is null', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            null as any,
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when yearsOfExperience is undefined', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            undefined as any,
            'Engineering'
          )
        ).rejects.toThrow()
      })
    })

    describe('Type Validation', () => {
      it('throws Zod error when roleTitle is not a string', async () => {
        await expect(
          createNewRoleNew(
            123 as any,
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescription is not a string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            456 as any,
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when roleDescriptionAi is not a string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            789 as any,
            '3',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when yearsOfExperience is not a string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            5 as any,
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when department is not a string', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            123 as any
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when skills is not an array', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering',
            'not-an-array' as any
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when skills array contains non-string elements', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering',
            ['React', 123, 'TypeScript'] as any
          )
        ).rejects.toThrow()
      })
    })

    describe('Multiple Field Validation', () => {
      it('throws Zod error when multiple required fields are invalid', async () => {
        await expect(
          createNewRoleNew(
            '',
            '',
            '',
            '',
            'Engineering'
          )
        ).rejects.toThrow()
      })

      it('throws Zod error when all fields are invalid types', async () => {
        await expect(
          createNewRoleNew(
            123 as any,
            456 as any,
            789 as any,
            0 as any,
            123 as any,
            'not-array' as any
          )
        ).rejects.toThrow()
      })
    })

    describe('Valid Input Scenarios', () => {
      it('accepts valid input with all required fields', async () => {
        mockCreate.mockResolvedValueOnce({
          newRoleId: 1,
          roleName: 'Frontend Engineer',
          descriptionPrompt: 'Build UI with React and TypeScript',
          descriptionAi: 'AI generated description',
          yearOfExperience: '3',
          department: 'Engineering',
          skill: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 0 })
        mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 0 })

        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).resolves.toBeUndefined()

        expect(mockCreate).toHaveBeenCalledWith({
          data: {
            roleName: 'Frontend Engineer',
            descriptionPrompt: 'Build UI with React and TypeScript',
            descriptionAi: 'AI generated description',
            yearOfExperience: '3',
            department: 'Engineering',
            skill: [],
          },
        })
      })

      it('accepts valid input with whitespace-only strings (should still fail validation)', async () => {
        await expect(
          createNewRoleNew(
            '   ',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job title is required/i)
      })

      it('accepts valid input with only whitespace in description (should still fail validation)', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            '   ',
            'AI generated description',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job description is required/i)
      })

      it('accepts valid input with only whitespace in AI description (should still fail validation)', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            '   ',
            '3',
            'Engineering'
          )
        ).rejects.toThrow(/job description ai is required/i)
      })

      it('accepts valid input with only whitespace in years of experience (should still fail validation)', async () => {
        await expect(
          createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '   ',
            'Engineering'
          )
        ).rejects.toThrow(/years of experience is required/i)
      })
    })

    describe('Zod Error Message Validation', () => {
      it('throws specific error message for roleTitle', async () => {
        try {
          await createNewRoleNew(
            '',
            'Build UI with React and TypeScript',
            'AI generated description',
            '3',
            'Engineering'
          )
        } catch (error: any) {
          expect(error.message).toContain('job title is required')
        }
      })

      it('throws specific error message for roleDescription', async () => {
        try {
          await createNewRoleNew(
            'Frontend Engineer',
            '',
            'AI generated description',
            '3',
            'Engineering'
          )
        } catch (error: any) {
          expect(error.message).toContain('job description is required')
        }
      })

      it('throws specific error message for roleDescriptionAi', async () => {
        try {
          await createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            '',
            '3',
            'Engineering'
          )
        } catch (error: any) {
          expect(error.message).toContain('job description ai is required')
        }
      })

      it('throws specific error message for yearsOfExperience', async () => {
        try {
          await createNewRoleNew(
            'Frontend Engineer',
            'Build UI with React and TypeScript',
            'AI generated description',
            '',
            'Engineering'
          )
        } catch (error: any) {
          expect(error.message).toContain('years of experience is required')
        }
      })
    })

    it('accepts valid input without optional department', async () => {
      mockCreate.mockResolvedValueOnce({
        newRoleId: 2,
        roleName: 'Data Analyst',
        descriptionPrompt: 'Analyze datasets using Python',
        descriptionAi: 'AI generated description',
        yearOfExperience: '2',
        department: null,
        skill: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await expect(
        createNewRoleNew(
          'Data Analyst',
          'Analyze datasets using Python',
          'AI generated description',
          '2'
        )
      ).resolves.toBeUndefined()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          roleName: 'Data Analyst',
          descriptionPrompt: 'Analyze datasets using Python',
          descriptionAi: 'AI generated description',
          yearOfExperience: '2',
          department: undefined,
          skill: [],
        },
      })
    })

    it('accepts valid input with skills array', async () => {
      mockCreate.mockResolvedValueOnce({
        newRoleId: 3,
        roleName: 'Frontend Developer',
        descriptionPrompt: 'Build responsive web applications',
        descriptionAi: 'AI generated description',
        yearOfExperience: '1',
        department: 'Engineering',
        skill: ['JavaScript', 'CSS'],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 0 })
      mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 0 })

      await expect(
        createNewRoleNew(
          'Frontend Developer',
          'Build responsive web applications',
          'AI generated description',
          '1',
          'Engineering',
          ['JavaScript', 'CSS']
        )
      ).resolves.toBeUndefined()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          roleName: 'Frontend Developer',
          descriptionPrompt: 'Build responsive web applications',
          descriptionAi: 'AI generated description',
          yearOfExperience: '1',
          department: 'Engineering',
          skill: ['JavaScript', 'CSS'],
        },
      })
    })

    it('accepts valid input with questions arrays', async () => {
      mockCreate.mockResolvedValueOnce({
        newRoleId: 4,
        roleName: 'Software Engineer',
        descriptionPrompt: 'Develop software applications',
        descriptionAi: 'AI generated description',
        yearOfExperience: '3',
        department: 'Engineering',
        skill: ['Python', 'React'],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 2 })
      mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 3 })

      const candidateQuestions = [
        'What is your experience with Python?',
        'How do you approach testing?',
        'Describe a challenging project you worked on'
      ]
      const roleQuestions = [
        'What are your thoughts on software architecture?',
        'How do you handle code reviews?'
      ]

      await expect(
        createNewRoleNew(
          'Software Engineer',
          'Develop software applications',
          'AI generated description',
          '3',
          'Engineering',
          ['Python', 'React'],
          candidateQuestions,
          roleQuestions
        )
      ).resolves.toBeUndefined()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          roleName: 'Software Engineer',
          descriptionPrompt: 'Develop software applications',
          descriptionAi: 'AI generated description',
          yearOfExperience: '3',
          department: 'Engineering',
          skill: ['Python', 'React'],
        },
      })

      expect(mockCreateManyCandidateQuestions).toHaveBeenCalledWith({
        data: candidateQuestions.map(question => ({
          candidateEvaluation: question,
          newRoleId: 4,
        })),
      })

      expect(mockCreateManyRoleQuestions).toHaveBeenCalledWith({
        data: roleQuestions.map(question => ({
          roleRelatedQuestion: question,
          newRoleId: 4,
        })),
      })
    })
  })

  describe('Database Operations', () => {
    it('saves new role to database with all fields', async () => {
      const mockCreatedRole = {
        newRoleId: 1,
        roleName: 'Frontend Engineer',
        descriptionAi: 'AI generated description',
        descriptionPrompt: 'Build UI with React and TypeScript',
        yearOfExperience: '3',
        department: 'Engineering',
        skill: ['TypeScript', 'React', 'Node.js'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCreate.mockResolvedValueOnce(mockCreatedRole)
      mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 0 })
      mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 0 })

      await expect(
        createNewRoleNew(
          'Frontend Engineer',
          'Build UI with React and TypeScript',
          'AI generated description',
          '3',
          'Engineering',
          ['TypeScript', 'React', 'Node.js']
        )
      ).resolves.toBeUndefined()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          roleName: 'Frontend Engineer',
          descriptionPrompt: 'Build UI with React and TypeScript',
          descriptionAi: 'AI generated description',
          yearOfExperience: '3',
          department: 'Engineering',
          skill: ['TypeScript', 'React', 'Node.js'],
        },
      })
    })

    it('saves new role to database without optional fields', async () => {
      const mockCreatedRole = {
        newRoleId: 2,
        roleName: 'Data Analyst',
        descriptionAi: 'AI generated description',
        descriptionPrompt: 'Analyze datasets using Python',
        yearOfExperience: '2',
        department: null,
        skill: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCreate.mockResolvedValueOnce(mockCreatedRole)
      mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 0 })
      mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 0 })

      await expect(
        createNewRoleNew(
          'Data Analyst',
          'Analyze datasets using Python',
          'AI generated description',
          '2'
        )
      ).resolves.toBeUndefined()

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          roleName: 'Data Analyst',
          descriptionPrompt: 'Analyze datasets using Python',
          descriptionAi: 'AI generated description',
          yearOfExperience: '2',
          department: undefined,
          skill: [],
        },
      })
    })

    it('handles database save errors', async () => {
      const dbError = new Error('Database connection failed')
      mockCreate.mockRejectedValueOnce(dbError)

      await expect(
        createNewRoleNew(
          'Frontend Engineer',
          'Build UI with React and TypeScript',
          'AI generated description',
          '3',
          'Engineering'
        )
      ).rejects.toThrow('Database connection failed')
    })

    it('handles database constraint violations', async () => {
      const constraintError = new Error('Unique constraint violation')
      mockCreate.mockRejectedValueOnce(constraintError)

      await expect(
        createNewRoleNew(
          'Frontend Engineer',
          'Build UI with React and TypeScript',
          'AI generated description',
          '3',
          'Engineering'
        )
      ).rejects.toThrow('Unique constraint violation')
    })

    it('saves questions to database when provided', async () => {
      const mockCreatedRole = {
        newRoleId: 5,
        roleName: 'Full Stack Developer',
        descriptionAi: 'AI generated description',
        descriptionPrompt: 'Develop full-stack applications',
        yearOfExperience: '4',
        department: 'Engineering',
        skill: ['JavaScript', 'Python', 'React'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const candidateQuestions = [
        'What is your experience with JavaScript?',
        'How do you handle database design?',
        'Describe your testing approach'
      ]
      const roleQuestions = [
        'What are your thoughts on microservices?',
        'How do you ensure code quality?'
      ]

      mockCreate.mockResolvedValueOnce(mockCreatedRole)
      mockCreateManyRoleQuestions.mockResolvedValueOnce({ count: 2 })
      mockCreateManyCandidateQuestions.mockResolvedValueOnce({ count: 3 })

      await expect(
        createNewRoleNew(
          'Full Stack Developer',
          'Develop full-stack applications',
          'AI generated description',
          '4',
          'Engineering',
          ['JavaScript', 'Python', 'React'],
          candidateQuestions,
          roleQuestions
        )
      ).resolves.toBeUndefined()

      expect(mockCreateManyCandidateQuestions).toHaveBeenCalledWith({
        data: candidateQuestions.map(question => ({
          candidateEvaluation: question,
          newRoleId: 5,
        })),
      })

      expect(mockCreateManyRoleQuestions).toHaveBeenCalledWith({
        data: roleQuestions.map(question => ({
          roleRelatedQuestion: question,
          newRoleId: 5,
        })),
      })
    })
  })
})
