import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/db/prisma';
import { enrollUserInCourses } from '@/db/courses';

// Validation schema for academy track data
const academyTrackSchema = z.object({
  userId: z.number().int().positive().default(1),
  selectedSpecializations: z.array(z.number().int().positive()).max(2, 'Maximum 2 specializations allowed'),
  selectedCareerPaths: z.array(z.number().int().positive()).min(1, 'At least 1 career path required'),
  selectedCourses: z.array(z.string()).optional().default([]),
});

// PUT - Update user's academy track (replace all selections)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = academyTrackSchema.parse(body);

    const {
      userId,
      selectedSpecializations,
      selectedCareerPaths,
      selectedCourses
    } = validatedData;

    // Use transaction to ensure all updates happen atomically
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing user specializations
      await tx.users_specialization.deleteMany({
        where: { user_id: userId }
      });

      // 2. Delete existing user career paths
      await tx.user_career_paths.deleteMany({
        where: { user_id: userId }
      });

      // 3. Insert new user specializations
      if (selectedSpecializations.length > 0) {
        await tx.users_specialization.createMany({
          data: selectedSpecializations.map(specId => ({
            user_id: userId,
            spec_id: specId,
            added_date: new Date()
          }))
        });
      }

      // 4. Insert new user career paths
      if (selectedCareerPaths.length > 0) {
        await tx.user_career_paths.createMany({
          data: selectedCareerPaths.map(careerId => ({
            user_id: userId,
            career_id: careerId
          }))
        });
      }
    });

    // 5. Handle course enrollments (outside transaction since it has its own)
    if (selectedCourses.length > 0) {
      await enrollUserInCourses(userId, selectedCourses, 'Spring', 2025);
    }

    return NextResponse.json({
      success: true,
      message: 'Academy track updated successfully',
      data: {
        specializations: selectedSpecializations.length,
        careerPaths: selectedCareerPaths.length,
        courses: selectedCourses.length
      }
    });

  } catch (error) {
    console.error('Error updating academy track:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update academy track' },
      { status: 500 }
    );
  }
}
