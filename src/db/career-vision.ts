import { prisma } from './prisma';

// Types for career vision
export interface VisionStatement {
  vision_id: number;
  user_id: number;
  vision_text: string;
  created_at: Date;
  updated_at: Date;
}

export interface GoalMilestone {
  milestone_id: number;
  goal_id: number;
  title: string;
  target_date: Date;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AnnualGoal {
  goal_id: number;
  user_id: number;
  year: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  target_date: Date;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  milestones?: GoalMilestone[];
}

// Vision Statement operations
export async function getUserVisionStatement(userId: number = 1): Promise<VisionStatement | null> {
  try {
    const visionStatement = await prisma.vision_statements.findFirst({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' }
    });

    return visionStatement;
  } catch (error) {
    console.error('Error fetching vision statement:', error);
    throw new Error('Failed to fetch vision statement');
  }
}

export async function createOrUpdateVisionStatement(data: {
  userId: number;
  visionText: string;
}): Promise<VisionStatement> {
  try {
    // Check if user already has a vision statement
    const existingVision = await prisma.vision_statements.findFirst({
      where: { user_id: data.userId }
    });

    if (existingVision) {
      // Update existing vision
      const updated = await prisma.vision_statements.update({
        where: { vision_id: existingVision.vision_id },
        data: {
          vision_text: data.visionText,
          updated_at: new Date()
        }
      });
      return updated;
    } else {
      // Create new vision
      const created = await prisma.vision_statements.create({
        data: {
          user_id: data.userId,
          vision_text: data.visionText
        }
      });
      return created;
    }
  } catch (error) {
    console.error('Error creating/updating vision statement:', error);
    throw new Error('Failed to save vision statement');
  }
}

// Annual Goals operations
export async function getUserAnnualGoals(userId: number = 1, year?: number): Promise<AnnualGoal[]> {
  try {
    const whereClause: any = { user_id: userId };
    
    if (year) {
      whereClause.year = year;
    }

    const goals = await prisma.annual_goals.findMany({
      where: whereClause,
      include: {
        milestones: {
          orderBy: { target_date: 'asc' }
        }
      },
      orderBy: [
        { year: 'desc' },
        { created_at: 'desc' }
      ]
    });

    return goals;
  } catch (error) {
    console.error('Error fetching annual goals:', error);
    throw new Error('Failed to fetch annual goals');
  }
}

export async function getAnnualGoalById(goalId: number, userId: number): Promise<AnnualGoal | null> {
  try {
    const goal = await prisma.annual_goals.findFirst({
      where: {
        goal_id: goalId,
        user_id: userId
      },
      include: {
        milestones: {
          orderBy: { target_date: 'asc' }
        }
      }
    });

    return goal;
  } catch (error) {
    console.error('Error fetching goal:', error);
    throw new Error('Failed to fetch goal');
  }
}

export async function createAnnualGoal(data: {
  userId: number;
  year: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: string;
  milestones?: Array<{ title: string; targetDate: string }>;
}): Promise<AnnualGoal> {
  try {
    // Check if a goal with the same title already exists for this user and year
    const existingGoal = await prisma.annual_goals.findFirst({
      where: {
        user_id: data.userId,
        year: data.year,
        title: data.title
      }
    });

    if (existingGoal) {
      throw new Error(`A goal with the title "${data.title}" already exists for ${data.year}`);
    }

    // Create the goal with milestones in a transaction
    const goal = await prisma.$transaction(async (tx) => {
      const createdGoal = await tx.annual_goals.create({
        data: {
          user_id: data.userId,
          year: data.year,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          target_date: new Date(data.targetDate),
          progress: 0,
          status: 'Not Started'
        }
      });

      // Create milestones if provided
      if (data.milestones && data.milestones.length > 0) {
        await tx.goal_milestones.createMany({
          data: data.milestones.map(milestone => ({
            goal_id: createdGoal.goal_id,
            title: milestone.title,
            target_date: new Date(milestone.targetDate),
            completed: false
          }))
        });
      }

      // Fetch the complete goal with milestones
      const goalWithMilestones = await tx.annual_goals.findUnique({
        where: { goal_id: createdGoal.goal_id },
        include: {
          milestones: {
            orderBy: { target_date: 'asc' }
          }
        }
      });

      return goalWithMilestones!;
    });

    return goal;
  } catch (error) {
    console.error('Error creating annual goal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create annual goal');
  }
}

export async function updateAnnualGoal(data: {
  goalId: number;
  userId: number;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  targetDate?: string;
  progress?: number;
  status?: string;
  milestones?: Array<{ id?: number; title: string; targetDate: string; completed?: boolean }>;
}): Promise<AnnualGoal> {
  try {
    // Verify the goal belongs to the user
    const existingGoal = await prisma.annual_goals.findFirst({
      where: {
        goal_id: data.goalId,
        user_id: data.userId
      },
      include: {
        milestones: true
      }
    });

    if (!existingGoal) {
      throw new Error('Goal not found or access denied');
    }

    // Check for duplicate title if title is being updated
    if (data.title && data.title !== existingGoal.title) {
      const duplicateGoal = await prisma.annual_goals.findFirst({
        where: {
          user_id: data.userId,
          year: existingGoal.year,
          title: data.title,
          goal_id: {
            not: data.goalId
          }
        }
      });

      if (duplicateGoal) {
        throw new Error(`A goal with the title "${data.title}" already exists for ${existingGoal.year}`);
      }
    }

    // Update the goal and milestones in a transaction
    const updatedGoal = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: any = {
        updated_at: new Date()
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.targetDate !== undefined) updateData.target_date = new Date(data.targetDate);
      if (data.progress !== undefined) {
        updateData.progress = data.progress;
        // Auto-update status based on progress
        if (data.progress === 0) {
          updateData.status = 'Not Started';
        } else if (data.progress === 100) {
          updateData.status = 'Completed';
        } else {
          updateData.status = 'In Progress';
        }
      }
      if (data.status !== undefined) updateData.status = data.status;

      // Update the goal
      await tx.annual_goals.update({
        where: { goal_id: data.goalId },
        data: updateData
      });

      // Update milestones if provided
      if (data.milestones) {
        // Delete existing milestones
        await tx.goal_milestones.deleteMany({
          where: { goal_id: data.goalId }
        });

        // Create new milestones
        if (data.milestones.length > 0) {
          await tx.goal_milestones.createMany({
            data: data.milestones.map(milestone => ({
              goal_id: data.goalId,
              title: milestone.title,
              target_date: new Date(milestone.targetDate),
              completed: milestone.completed || false
            }))
          });
        }
      }

      // Fetch the updated goal with milestones
      const goal = await tx.annual_goals.findUnique({
        where: { goal_id: data.goalId },
        include: {
          milestones: {
            orderBy: { target_date: 'asc' }
          }
        }
      });

      return goal!;
    });

    return updatedGoal;
  } catch (error) {
    console.error('Error updating annual goal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update annual goal');
  }
}

export async function deleteAnnualGoal(goalId: number, userId: number): Promise<void> {
  try {
    // Verify the goal belongs to the user
    const goal = await prisma.annual_goals.findFirst({
      where: {
        goal_id: goalId,
        user_id: userId
      }
    });

    if (!goal) {
      throw new Error('Goal not found or access denied');
    }

    // Delete the goal (milestones will be cascade deleted)
    await prisma.annual_goals.delete({
      where: { goal_id: goalId }
    });
  } catch (error) {
    console.error('Error deleting annual goal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete annual goal');
  }
}

export async function updateGoalProgress(
  goalId: number,
  userId: number,
  progress: number
): Promise<AnnualGoal> {
  try {
    // Verify the goal belongs to the user
    const goal = await prisma.annual_goals.findFirst({
      where: {
        goal_id: goalId,
        user_id: userId
      }
    });

    if (!goal) {
      throw new Error('Goal not found or access denied');
    }

    // Validate progress
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    // Determine status based on progress
    let status = goal.status;
    if (progress === 0) {
      status = 'Not Started';
    } else if (progress === 100) {
      status = 'Completed';
    } else {
      status = 'In Progress';
    }

    // Update the goal
    const updatedGoal = await prisma.annual_goals.update({
      where: { goal_id: goalId },
      data: {
        progress,
        status,
        updated_at: new Date()
      },
      include: {
        milestones: {
          orderBy: { target_date: 'asc' }
        }
      }
    });

    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal progress:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update goal progress');
  }
}

