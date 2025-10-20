import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserExternalCourses,
  addUserExternalCourse,
  deleteUserExternalCourse
} from '@/db/portfolio';

// Validation schemas
const addExternalCourseSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  platform: z.string().min(1, 'Platform is required'),
  description: z.string().default(''),
  skills: z.string().default(''),
  completionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  duration: z.string().optional(),
  userId: z.number().int().positive().default(1)
});

const deleteExternalCourseSchema = z.object({
  userExtCourseId: z.number().int().positive(),
  userId: z.number().int().positive().default(1)
});

// GET - Fetch user external courses
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

    const externalCourses = await getUserExternalCourses(userId);

    return NextResponse.json({
      success: true,
      data: externalCourses
    });
  } catch (error) {
    console.error('Error fetching external courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external courses' },
      { status: 500 }
    );
  }
}

// POST - Add new external course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = addExternalCourseSchema.parse(body);

    const externalCourse = await addUserExternalCourse({
      userId: validatedData.userId,
      courseName: validatedData.courseName,
      platform: validatedData.platform,
      description: validatedData.description,
      skills: validatedData.skills,
      completionDate: validatedData.completionDate,
      duration: validatedData.duration
    });

    return NextResponse.json({
      success: true,
      message: 'External course added successfully',
      data: externalCourse
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

    console.error('Error adding external course:', error);
    return NextResponse.json(
      { error: 'Failed to add external course' },
      { status: 500 }
    );
  }
}

// DELETE - Remove external course
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = deleteExternalCourseSchema.parse(body);

    await deleteUserExternalCourse(validatedData.userId, validatedData.userExtCourseId);

    return NextResponse.json({
      success: true,
      message: 'External course deleted successfully'
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

    console.error('Error deleting external course:', error);
    return NextResponse.json(
      { error: 'Failed to delete external course' },
      { status: 500 }
    );
  }
}
