import { generateJobDescription } from '@/app/api/v1/roles/generate-jd/controller'
import { ZodError } from 'zod'

const createMock = jest.fn().mockResolvedValue({
  choices: [{
    message: {
      parsed: {
        job_description: 'We are seeking a Frontend Engineer to join our team...'
      }
    }
  }],
})

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createMock,
      },
    },
  }))
})

describe('generateJobDescription', () => {
  const generateJobDescriptionNew = generateJobDescription as unknown as (
    roleTitle: string,
    roleDescription: string,
    yearsOfExperience: string,
    department?: string,
    skills?: string[]
  ) => Promise<string>

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('generates job description for valid inputs', async () => {
    const mockJobDescription = 'We are seeking a Frontend Engineer to join our team. You will be responsible for building user interfaces using React and TypeScript...'
    createMock.mockResolvedValueOnce({
      choices: [{
        message: {
          parsed: {
            job_description: mockJobDescription
          }
        }
      }],
    })

    const jobDescription = await generateJobDescriptionNew(
      'Frontend Engineer',
      'Build UI with React and TypeScript; backend with Node.js',
      '3',
      'Engineering',
      ['React', 'TypeScript', 'Node.js']
    )

    expect(jobDescription).toBe(mockJobDescription)
  })

  it('generates job description without department but with skills', async () => {
    const mockJobDescription = 'We are looking for a Data Analyst to analyze datasets...'
    createMock.mockResolvedValueOnce({
      choices: [{
        message: {
          parsed: {
            job_description: mockJobDescription
          }
        }
      }],
    })

    const jobDescription = await generateJobDescriptionNew(
      'Data Analyst',
      'Analyze datasets using Python and data tools',
      '1',
      undefined,
      ['Python', 'SQL', 'Tableau', 'Data Visualization']
    )

    expect(jobDescription).toBe(mockJobDescription)
  })

  it('generates job description without skills array', async () => {
    const mockJobDescription = 'We are seeking a Backend Engineer...'
    createMock.mockResolvedValueOnce({
      choices: [{
        message: {
          parsed: {
            job_description: mockJobDescription
          }
        }
      }],
    })

    const jobDescription = await generateJobDescriptionNew(
      'Backend Engineer',
      'Work on backend services',
      '4',
      'Engineering'
    )

    expect(jobDescription).toBe(mockJobDescription)
  })

  it('throws ZodError when role title is missing', async () => {
    await expect(
      generateJobDescriptionNew(
        '',
        'Work on backend services',
        '4',
        'Engineering'
      )
    ).rejects.toThrow(ZodError)
  })

  it('throws ZodError when role description is missing', async () => {
    await expect(
      generateJobDescriptionNew(
        'Backend Engineer',
        '',
        '4',
        'Engineering'
      )
    ).rejects.toThrow(ZodError)
  })

  it('throws ZodError when years of experience is missing', async () => {
    await expect(
      generateJobDescriptionNew(
        'Backend Engineer',
        'Work on backend services',
        '',
        'Engineering'
      )
    ).rejects.toThrow(ZodError)
  })

  it('handles OpenAI response with content fallback when parsed is not available', async () => {
    const mockJobDescription = 'We are seeking a Frontend Engineer...'
    createMock.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({ job_description: mockJobDescription })
        }
      }],
    })

    const jobDescription = await generateJobDescriptionNew(
      'Frontend Engineer',
      'Build UI with React and TypeScript',
      '3',
      'Engineering'
    )

    expect(jobDescription).toBe(mockJobDescription)
  })

  it('propagates upstream error when OpenAI fails', async () => {
    createMock.mockRejectedValueOnce(new Error('OpenAI API failure'))
    await expect(
      generateJobDescriptionNew(
        'ML Engineer',
        'Build and deploy ML models',
        '2',
        'AI Lab',
        ['Python', 'TensorFlow']
      )
    ).rejects.toThrow(/openai api failure/i)
  })
})
