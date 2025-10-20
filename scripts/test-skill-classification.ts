import { classifySkillsWithOpenAI, fallbackSkillClassification } from './classify-job-skills'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Test cases with known correct classifications
const testSkills = [
  // Should be HARD skills
  'JavaScript', 'Python', 'React', 'Docker', 'Kubernetes', 'MySQL', 'AWS', 'Git', 'Linux',
  'Solidity', 'Ethereum', 'Web3.js', 'Truffle', 'Hardhat', 'TDD', 'BDD', 'Agile', 'Scrum',
  'Android Development', 'iOS', 'Machine Learning', 'Data Structures', 'Algorithms',
  'CI/CD', 'Jenkins', 'Terraform', 'MongoDB', 'Redis', 'PostgreSQL',
  
  // Should be SOFT skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management',
  'Attention to Detail', 'Creativity', 'Adaptability', 'Critical Thinking',
  'Project Management', 'Mentoring', 'Collaboration', 'Self Motivated',
  'Continuous Learning', 'Emotional Intelligence', 'Proactive', 'Ownership'
]

async function testClassification() {
  console.log('🧪 Testing Skill Classification Accuracy\n')
  
  console.log('Testing with OpenAI API...')
  try {
    const openaiResult = await classifySkillsWithOpenAI(testSkills.slice(0, 10)) // Test with first 10 skills
    console.log('OpenAI Results:')
    console.log('Hard Skills:', openaiResult.hardSkills)
    console.log('Soft Skills:', openaiResult.softSkills)
    console.log()
  } catch (error) {
    console.log('OpenAI API failed, testing fallback...')
  }
  
  console.log('Testing Fallback Algorithm...')
  const fallbackResult = fallbackSkillClassification(testSkills)
  
  console.log('Fallback Results:')
  console.log('Hard Skills:', fallbackResult.hardSkills)
  console.log('Soft Skills:', fallbackResult.softSkills)
  console.log()
  
  // Analyze accuracy
  const expectedHard = ['JavaScript', 'Python', 'React', 'Docker', 'Kubernetes', 'MySQL', 'AWS', 'Git', 'Linux', 'Solidity', 'Ethereum', 'Web3.js', 'Truffle', 'Hardhat', 'TDD', 'BDD', 'Agile', 'Scrum', 'Android Development', 'iOS', 'Machine Learning', 'Data Structures', 'Algorithms', 'CI/CD', 'Jenkins', 'Terraform', 'MongoDB', 'Redis', 'PostgreSQL']
  const expectedSoft = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management', 'Attention to Detail', 'Creativity', 'Adaptability', 'Critical Thinking', 'Project Management', 'Mentoring', 'Collaboration', 'Self Motivated', 'Continuous Learning', 'Emotional Intelligence', 'Proactive', 'Ownership']
  
  console.log('📊 Accuracy Analysis:')
  
  // Check hard skills accuracy
  const correctHard = fallbackResult.hardSkills.filter(skill => expectedHard.includes(skill))
  const incorrectHard = fallbackResult.hardSkills.filter(skill => expectedSoft.includes(skill))
  
  // Check soft skills accuracy  
  const correctSoft = fallbackResult.softSkills.filter(skill => expectedSoft.includes(skill))
  const incorrectSoft = fallbackResult.softSkills.filter(skill => expectedHard.includes(skill))
  
  console.log(`✅ Correctly classified hard skills: ${correctHard.length}/${expectedHard.length}`)
  console.log(`❌ Incorrectly classified as hard: ${incorrectHard.join(', ') || 'None'}`)
  console.log(`✅ Correctly classified soft skills: ${correctSoft.length}/${expectedSoft.length}`)
  console.log(`❌ Incorrectly classified as soft: ${incorrectSoft.join(', ') || 'None'}`)
  
  const totalCorrect = correctHard.length + correctSoft.length
  const totalSkills = testSkills.length
  const accuracy = ((totalCorrect / totalSkills) * 100).toFixed(1)
  
  console.log(`\n🎯 Overall Accuracy: ${accuracy}% (${totalCorrect}/${totalSkills})`)
}

// Run the test
if (require.main === module) {
  testClassification()
}
