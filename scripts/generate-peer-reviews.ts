import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path' ;
import { writeFileSync } from 'fs';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Trait definitions for real seeded users
const studentTraits = {
  2: { // Bob Chen
    strengths: ['Excellent problem-solving skills', 'Strong attention to detail', 'Quick learner', 'Collaborative mindset', 'Great communicator'],
    weaknesses: ['Can be overly cautious with new ideas', 'Sometimes spends too much time perfecting details', 'Needs more confidence in leadership roles'],
    collaboration: ['Very reliable in teamwork', 'Encourages others to contribute', 'Resolves conflicts constructively', 'Always meets deadlines']
  },
  3: { // Carol Martinez
    strengths: ['Creative thinker', 'Strong technical foundation', 'Good mentor to juniors', 'Organized project planner', 'Excellent presentation skills'],
    weaknesses: ['Sometimes overanalyzes problems', 'Can hesitate to delegate tasks', 'Needs to balance creativity with practicality'],
    collaboration: ['Brings innovative ideas to the team', 'Supports peers with technical issues', 'Takes initiative in discussions', 'Promotes positive teamwork']
  },
  4: { // David Kim
    strengths: ['Great at adapting to new tools', 'Strong in backend development', 'Efficient under pressure', 'Consistent performer', 'Analytical mindset'],
    weaknesses: ['Could communicate ideas more assertively', 'Sometimes skips documentation details', 'Needs to develop design awareness'],
    collaboration: ['Very dependable teammate', 'Helps debug others’ work', 'Maintains team harmony', 'Always delivers on time']
  },
  5: { // Eva Singh
    strengths: ['Excellent team collaboration', 'Creative in problem-solving', 'Great at documentation', 'Empathetic listener', 'Effective in cross-functional work'],
    weaknesses: ['Could improve technical confidence', 'Sometimes takes on too many responsibilities', 'Needs to delegate more effectively'],
    collaboration: ['Positive energy in group projects', 'Encourages inclusion', 'Provides constructive feedback', 'Balances workload well']
  }
};

interface PeerReview {
  reviewer_id: number;
  reviewee_id: number;
  academic_performance_rating: number;
  collaboration_teamwork_rating: number;
  strengths_feedback: string;
  areas_for_improvement: string;
  additional_comments?: string;
  review_date: Date;
}

async function getStudentsFromDB() {
  // Pull actual seeded users (IDs 2–5)
  const users = await prisma.users.findMany({
    where: {
      user_id: { in: [2, 3, 4, 5] },
    },
  });

  // Assign a mock major/year for review context
  return users.map(u => ({
    id: u.user_id,
    name: u.user_name,
    major: 'Computer Science and Design',
    year: `Year ${faker.number.int({ min: 2, max: 4 })}`
  }));
}

async function generatePeerReview(
  reviewer: any,
  reviewee: any
): Promise<PeerReview> {
  const traits = studentTraits[reviewee.id as keyof typeof studentTraits];
  if (!traits) throw new Error(`No traits found for user ID ${reviewee.id}`);

  const academicRating = faker.number.int({ min: 3, max: 5 });
  const collaborationRating = faker.number.int({ min: 3, max: 5 });

  const strengthsPrompt = `Generate a detailed peer review strengths section for ${reviewee.name}, a ${reviewee.year} student in ${reviewee.major}. 
  Key strengths: ${traits.strengths.join(', ')}
  Collaboration traits: ${traits.collaboration.join(', ')}
  Write 2-3 specific examples showing how these strengths helped team success. Keep it professional and under 1000 characters.`;

  const strengthsResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: strengthsPrompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  const improvementPrompt = `Generate constructive feedback for areas of improvement for ${reviewee.name}, a ${reviewee.year} student in ${reviewee.major}.
  Weaknesses: ${traits.weaknesses.join(', ')}
  Provide 2-3 actionable suggestions for improvement. Keep it supportive and under 1000 characters.`;

  const improvementResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: improvementPrompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  let additionalComments: string | undefined;
  if (faker.datatype.boolean()) {
    const additionalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Generate optional brief comments about collaborating with ${reviewee.name}. Keep under 500 characters.`,
      }],
      max_tokens: 150,
      temperature: 0.7,
    });
    additionalComments = additionalResponse.choices[0]?.message?.content?.trim();
  }

  return {
    reviewer_id: reviewer.id,
    reviewee_id: reviewee.id,
    academic_performance_rating: academicRating,
    collaboration_teamwork_rating: collaborationRating,
    strengths_feedback: strengthsResponse.choices[0]?.message?.content?.trim() || '',
    areas_for_improvement: improvementResponse.choices[0]?.message?.content?.trim() || '',
    additional_comments: additionalComments,
    review_date: faker.date.recent({ days: 30 }),
  };
}

async function generateAllPeerReviews(students: any[]): Promise<PeerReview[]> {
  const reviews: PeerReview[] = [];
  const reviewCount = 25;
  console.log('Generating peer reviews...');

  for (let i = 0; i < reviewCount; i++) {
    let reviewer: any, reviewee: any;
    do {
      reviewer = faker.helpers.arrayElement(students);
      reviewee = faker.helpers.arrayElement(students);
    } while (reviewer.id === reviewee.id);

    try {
      const review = await generatePeerReview(reviewer, reviewee);
      reviews.push(review);
      console.log(`Generated review ${i + 1}/${reviewCount}: ${reviewer.name} → ${reviewee.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Error generating review ${i + 1}:`, err);
    }
  }
  return reviews;
}

async function main() {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Missing OPENAI_API_KEY in .env')
        process.exit(1)
      }
  
      console.log('Fetching students from database...')
      const students = await getStudentsFromDB()
  
      console.log('Starting peer review generation...')
      const reviews = await generateAllPeerReviews(students)
  
      // Save to JSON instead of database
      const outputPath = path.join(__dirname, '../prisma/data/generated_peer_reviews.json')
      writeFileSync(outputPath, JSON.stringify(reviews, null, 2))
      console.log(`\n💾 Saved ${reviews.length} peer reviews to ${outputPath}`)
  
      // Summary table
      console.log('\n📊 Review distribution:')
      console.table(
        reviews.reduce((acc, r) => {
          const name = students.find(s => s.id === r.reviewee_id)?.name || 'Unknown'
          acc[name] = (acc[name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      )
    } catch (err) {
      console.error('❌ Error in main process:', err)
    } finally {
      await prisma.$disconnect()
    }
  }
  
  if (require.main === module) main()
  
  export { generatePeerReview, generateAllPeerReviews }
