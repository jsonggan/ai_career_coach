import { NextResponse } from 'next/server'
import { getRoleInformationById, searchCandidatesStream } from './controller';

export async function POST(req: Request) {
  const body = await req.json();
  const { new_role_id } = body as {
    new_role_id?: number;
  };

  try {
    const resolvedNewRoleId = typeof new_role_id === 'number' ? new_role_id : null;

    if (!resolvedNewRoleId) {
      return NextResponse.json(
        { error: 'new_role_id is required' },
        { status: 400 }
      );
    }

    const roleInfo = await getRoleInformationById(resolvedNewRoleId);
    if (!roleInfo) {
      return NextResponse.json(
        { error: `Role not found for ID: ${resolvedNewRoleId}` },
        { status: 404 }
      );
    }

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(message));
        };

        try {
          // Send initial status
          sendEvent('status', {
            type: 'start',
            message: `Starting candidate search for role: ${roleInfo.roleTitle}`
          });

          const result = await searchCandidatesStream(roleInfo, sendEvent);

          // Send final result
          sendEvent('result', result);
          sendEvent('status', { type: 'complete', message: 'Candidate search completed' });

        } catch (error: any) {
          sendEvent('error', {
            message: error?.message || 'Internal server error',
            type: 'error'
          });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error: any) {
    console.error('Error in candidate search:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
