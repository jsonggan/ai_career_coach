import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const document = await prisma.userDocument.findUnique({
      where: {
        userDocumentId: params.documentId
      },
      select: {
        content: true,
        mimeType: true,
        filename: true
      }
    });

    if (!document) {
      return new NextResponse('Document not found', { status: 404 });
    }

    return new NextResponse(document.content, {
      headers: {
        'Content-Type': document.mimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${document.filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
