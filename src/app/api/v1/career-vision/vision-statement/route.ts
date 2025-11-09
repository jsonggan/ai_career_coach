import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getUserVisionStatement,
  createOrUpdateVisionStatement
} from '@/db/career-vision';

// Validation schemas
const visionStatementSchema = z.object({
  visionText: z.string().min(10, 'Vision statement must be at least 10 characters')
});

// GET - Fetch user's vision statement
export async function GET(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
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
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validatedData = visionStatementSchema.parse(body);

    const visionStatement = await createOrUpdateVisionStatement({
      userId,
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

