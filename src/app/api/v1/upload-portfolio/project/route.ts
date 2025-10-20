import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserProjects,
  addUserProject,
  deleteUserProject
} from '@/db/portfolio';

// Validation schemas
const addProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectType: z.string().min(1, 'Project type is required'),
  description: z.string().default(''),
  technologies: z.string().default(''),
  skills: z.string().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  link: z.string().url().optional().or(z.literal('')),
  userId: z.number().int().positive().default(1)
});

const deleteProjectSchema = z.object({
  projectId: z.number().int().positive(),
  userId: z.number().int().positive().default(1)
});

// GET - Fetch user projects
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

    const projects = await getUserProjects(userId);

    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Add new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = addProjectSchema.parse(body);

    const project = await addUserProject({
      userId: validatedData.userId,
      projectName: validatedData.projectName,
      projectType: validatedData.projectType,
      description: validatedData.description,
      technologies: validatedData.technologies,
      skills: validatedData.skills,
      date: validatedData.date,
      link: validatedData.link || undefined
    });

    return NextResponse.json({
      success: true,
      message: 'Project added successfully',
      data: project
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

    console.error('Error adding project:', error);
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    );
  }
}

// DELETE - Remove project
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = deleteProjectSchema.parse(body);

    await deleteUserProject(validatedData.userId, validatedData.projectId);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
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

    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
