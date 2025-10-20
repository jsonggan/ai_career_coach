import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserCertificates,
  addUserCertificate,
  deleteUserCertificate
} from '@/db/portfolio';

// Validation schemas
const addCertificateSchema = z.object({
  certName: z.string().min(1, 'Certificate name is required'),
  certProvider: z.string().min(1, 'Certificate provider is required'),
  dateObtained: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  userId: z.number().int().positive().default(1)
});

const deleteCertificateSchema = z.object({
  userCertId: z.number().int().positive(),
  userId: z.number().int().positive().default(1)
});

// GET - Fetch user certificates
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

    const certificates = await getUserCertificates(userId);

    return NextResponse.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST - Add new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = addCertificateSchema.parse(body);

    const certificate = await addUserCertificate({
      userId: validatedData.userId,
      certName: validatedData.certName,
      certProvider: validatedData.certProvider,
      dateObtained: validatedData.dateObtained,
      expiryDate: validatedData.expiryDate
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate added successfully',
      data: certificate
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

    console.error('Error adding certificate:', error);
    return NextResponse.json(
      { error: 'Failed to add certificate' },
      { status: 500 }
    );
  }
}

// DELETE - Remove certificate
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = deleteCertificateSchema.parse(body);

    await deleteUserCertificate(validatedData.userId, validatedData.userCertId);

    return NextResponse.json({
      success: true,
      message: 'Certificate deleted successfully'
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

    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}
