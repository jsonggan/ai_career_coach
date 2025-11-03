import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserVisionStatement,
  createOrUpdateVisionStatement
} from '@/db/career-vision';

// Validation schemas
const visionStatementSchema = z.object({
  visionText: z.string().min(10, 'Vision statement must be at least 10 characters'),
  userId: z.number().int().positive().default(1)
});

// GET - Fetch user's vision statement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const visionStatement = await getUserVisionStatement(userId);

    return NextResponse.json({
      success: true,
      data: visionStatement
    });
  } catch (error) {
    console.error('Error fetching vision statement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vision statement' },
      { status: 500 }
    );
  }
}

// POST/PUT - Create or update vision statement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = visionStatementSchema.parse(body);

    const visionStatement = await createOrUpdateVisionStatement({
      userId: validatedData.userId,
      visionText: validatedData.visionText
    });

    return NextResponse.json({
      success: true,
      message: 'Vision statement saved successfully',
      data: visionStatement
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

    console.error('Error saving vision statement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save vision statement' },
      { status: 500 }
    );
  }
}

