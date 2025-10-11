import { generateSkillTags } from '@/app/api/v1/roles/generate-skill/controller'

const createMock = jest.fn().mockResolvedValue({
  choices: [{ message: { content: 'TypeScript, React, Node.js' } }],
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

describe('generateSkillTags', () => {
  const generateSkillTagsNew = generateSkillTags as unknown as (
    jobTitle: string,
    jobDescription: string,
    yearsOfExperience: string,
    department?: string
  ) => Promise<string[]>

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('generate skill tags returns parsed skills for valid inputs', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'TypeScript, React, Node.js' } }],
    })
    const tags = await generateSkillTagsNew(
      'Frontend Engineer',
      'Build UI with React and TypeScript; backend with Node.js',
      '3',
      'Engineering'
    )
    expect(tags).toEqual(['TypeScript', 'React', 'Node.js'])
  })

  it('generate skill tags returns empty list when model returns empty content', async () => {
    createMock.mockResolvedValueOnce({ choices: [{ message: { content: '' } }] })
    const tags = await generateSkillTagsNew(
      'Frontend Engineer',
      'Work with modern frontend stack',
      '2',
      'Engineering'
    )
    expect(tags).toEqual([])
  })

  it('generate skill tags trims whitespace and filters empty entries', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: '  React  ,  , TypeScript ,  Node.js  ' } }],
    })
    const tags = await generateSkillTagsNew(
      'Frontend Engineer',
      'React, TypeScript and Node.js experience',
      '5',
      'Engineering'
    )
    expect(tags).toEqual(['React', 'TypeScript', 'Node.js'])
  })

  it('generate skill tags without department succeeds', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'Python, Data Analysis' } }],
    })
    const tags = await generateSkillTagsNew(
      'Data Analyst',
      'Analyze datasets using Python and data tools',
      '1'
    )
    expect(tags).toEqual(['Python', 'Data Analysis'])
  })

  it('generate skill tags throws error when job title missing', async () => {
    await expect(
      generateSkillTagsNew(
        '',
        'Work on backend services',
        '4',
        'Engineering'
      )
    ).rejects.toThrow(/job title/i)
  })

  it('generate skill tags throws error when job description missing', async () => {
    await expect(
      generateSkillTagsNew('Backend Engineer', '', 4, 'Engineering')
    ).rejects.toThrow(/job description/i)
  })

  it('generate skill tags propagates upstream error when OpenAI fails', async () => {
    createMock.mockRejectedValueOnce(new Error('Upstream failure'))
    await expect(
      generateSkillTagsNew(
        'ML Engineer',
        'Build and deploy ML models',
        '2',
        'AI Lab'
      )
    ).rejects.toThrow(/upstream|openai|failure/i)
  })
})
