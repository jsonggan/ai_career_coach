import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserAnnualGoals,
  createAnnualGoal,
  updateAnnualGoal,
  deleteAnnualGoal,
  updateGoalProgress
} from '@/db/career-vision';

// Validation schemas
const milestoneSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Milestone title is required'),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  completed: z.boolean().optional().default(false)
});

const createGoalSchema = z.object({
  userId: z.number().int().positive().default(1),
  year: z.number().int().min(2020).max(2100),
  title: z.string().min(1, 'Goal title is required'),
  description: z.string().min(1, 'Goal description is required'),
  category: z.enum(['Career', 'Skills', 'Personal', 'Education', 'Health']),
  priority: z.enum(['High', 'Medium', 'Low']),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  milestones: z.array(milestoneSchema).optional()
});

const updateGoalSchema = z.object({
  goalId: z.number().int().positive(),
  userId: z.number().int().positive().default(1),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(['Career', 'Skills', 'Personal', 'Education', 'Health']).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
  milestones: z.array(milestoneSchema).optional()
});

const deleteGoalSchema = z.object({
  goalId: z.number().int().positive(),
  userId: z.number().int().positive().default(1)
});

const updateProgressSchema = z.object({
  goalId: z.number().int().positive(),
  userId: z.number().int().positive().default(1),
  progress: z.number().int().min(0).max(100)
});

// GET - Fetch user's annual goals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (year && (isNaN(year) || year < 2020 || year > 2100)) {
      return NextResponse.json(
        { error: 'Invalid year' },
        { status: 400 }
      );
    }

    const goals = await getUserAnnualGoals(userId, year);

    return NextResponse.json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST - Create new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createGoalSchema.parse(body);

    const goal = await createAnnualGoal({
      userId: validatedData.userId,
      year: validatedData.year,
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      priority: validatedData.priority,
      targetDate: validatedData.targetDate,
      milestones: validatedData.milestones
    });

    return NextResponse.json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create goal' },
      { status: 500 }
    );
  }
}

// PUT - Update existing goal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = updateGoalSchema.parse(body);

    const goal = await updateAnnualGoal(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE - Remove goal
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = deleteGoalSchema.parse(body);

    await deleteAnnualGoal(validatedData.goalId, validatedData.userId);

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

// PATCH - Update goal progress only
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = updateProgressSchema.parse(body);

    const goal = await updateGoalProgress(
      validatedData.goalId,
      validatedData.userId,
      validatedData.progress
    );

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      data: goal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update progress' },
      { status: 500 }
    );
  }
}

