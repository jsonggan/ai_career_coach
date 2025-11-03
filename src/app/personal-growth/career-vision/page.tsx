import CareerVisionClient, { Goal } from './career-vision-client';
import { getUserVisionStatement, getUserAnnualGoals } from '@/db/career-vision';

export default async function CareerVisionPage() {
  const userId = 1; // Hardcoded as per requirement
  const currentYear = new Date().getFullYear();
  
  // Fetch initial data
  let initialVision = '';
  let initialGoals: Goal[] = [];

  try {
    const visionData = await getUserVisionStatement(userId);
    if (visionData) {
      initialVision = visionData.vision_text;
    }

    const goalsData = await getUserAnnualGoals(userId, currentYear);
    initialGoals = goalsData.map(goal => ({
      id: goal.goal_id.toString(),
      title: goal.title,
      description: goal.description,
      category: goal.category as any,
      priority: goal.priority as any,
      targetDate: goal.target_date.toISOString().split('T')[0],
      progress: goal.progress,
      status: goal.status as any,
      year: goal.year,
      milestones: goal.milestones?.map(m => ({
        id: m.milestone_id.toString(),
        title: m.title,
        targetDate: m.target_date.toISOString().split('T')[0],
        completed: m.completed
      })) || []
    }));
  } catch (error) {
    console.error('Error loading career vision data:', error);
    // Continue with empty data if fetch fails
  }

  return (
    <CareerVisionClient 
      initialVision={initialVision}
      initialGoals={initialGoals}
    />
  );
}
