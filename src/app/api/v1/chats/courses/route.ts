import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { prompt, sessionId } = await request.json();

    if (!prompt || !sessionId) {
      return NextResponse.json(
        { message: 'Prompt and sessionId are required.' },
        { status: 400 }
      );
    }

    // Log request details for debugging
    console.log(`[Bedrock Agent] Request started at ${new Date().toISOString()}`);
    console.log(`[Bedrock Agent] Session ID: ${sessionId}`);
    console.log(`[Bedrock Agent] Prompt length: ${prompt.length} characters`);

    // Initialize Bedrock Agent Runtime Client with more detailed config
    const region = process.env.AWS_REGION || 'ap-southeast-1';
    const agentId = process.env.BEDROCK_AGENT_ID || 'W2EFDETNXZ';
    const agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID || 'FFN6QBGJJ3';

    console.log(`[Bedrock Agent] Using region: ${region}`);
    console.log(`[Bedrock Agent] Agent ID: ${agentId}`);
    console.log(`[Bedrock Agent] Alias ID: ${agentAliasId}`);

    const client = new BedrockAgentRuntimeClient({
      region,
      maxAttempts: 2, // Reduce retry attempts for faster debugging
    });

    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId: agentAliasId, // Try changing this to "TSTALIASID" for testing
      sessionId,
      inputText: prompt,
    });

    console.log(`[Bedrock Agent] Sending command to AWS Bedrock...`);

    const response = await client.send(command);

    console.log(`[Bedrock Agent] Response received, setting up streaming...`);

    if (response.completion === undefined) {
      throw new Error("Completion is undefined - agent may not be properly configured");
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          const metadata = JSON.stringify({
            type: 'metadata',
            sessionId,
            agentId,
            agentAliasId,
            region,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(`data: ${metadata}\n\n`);

          let completion = "";

          // Process the streaming response - we know completion is defined from the check above
          for await (const chunkEvent of response.completion!) {
            if (chunkEvent.chunk?.bytes) {
              const decodedResponse = new TextDecoder("utf-8").decode(chunkEvent.chunk.bytes);
              completion += decodedResponse;

              // Send chunk data to client
              const chunkData = JSON.stringify({
                type: 'chunk',
                data: decodedResponse,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(`data: ${chunkData}\n\n`);
            } else if (chunkEvent.trace) {
              // Log trace events for debugging
              console.log(`[Bedrock Agent] Trace event:`, JSON.stringify(chunkEvent.trace, null, 2));

              // Optionally send trace data to client for debugging
              const traceData = JSON.stringify({
                type: 'trace',
                data: chunkEvent.trace,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(`data: ${traceData}\n\n`);
            } else if (chunkEvent.returnControl) {
              // Handle return control events
              console.log(`[Bedrock Agent] Return control event:`, JSON.stringify(chunkEvent.returnControl, null, 2));

              const controlData = JSON.stringify({
                type: 'control',
                data: chunkEvent.returnControl,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(`data: ${controlData}\n\n`);
            }
          }

          const duration = Date.now() - startTime;
          console.log(`[Bedrock Agent] Request completed successfully in ${duration}ms`);
          console.log(`[Bedrock Agent] Completion length: ${completion.length} characters`);

          // Send completion event
          const completionData = JSON.stringify({
            type: 'done',
            completion: completion || "No response generated",
            duration,
            success: true,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(`data: ${completionData}\n\n`);
          controller.close();

        } catch (streamError) {
          console.error(`[Bedrock Agent] Streaming error:`, streamError);

          const errorData = JSON.stringify({
            type: 'error',
            message: streamError instanceof Error ? streamError.message : 'Streaming error',
            timestamp: new Date().toISOString()
          });
          controller.enqueue(`data: ${errorData}\n\n`);
          controller.error(streamError);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error(`[Bedrock Agent] Error after ${duration}ms:`, error);
    console.error(`[Bedrock Agent] Error name: ${error?.name}`);
    console.error(`[Bedrock Agent] Error code: ${error?.Code || error?.$fault}`);
    console.error(`[Bedrock Agent] Error message: ${error?.message}`);
    console.error(`[Bedrock Agent] Error metadata:`, error?.$metadata);

    // Provide specific error messages based on error type
    let userMessage = 'Error invoking Bedrock agent.';
    let debugInfo: any = {
      errorName: error?.name,
      errorCode: error?.Code || error?.$fault,
      duration
    };

    if (error?.name === 'DependencyFailedException') {
      userMessage = 'Agent dependencies are not ready. The agent may still be preparing or has configuration issues.';
      debugInfo.suggestions = [
        'Check if the agent is in PREPARED state',
        'Verify agent action groups are properly configured',
        'Check knowledge base connectivity if applicable',
        'Ensure all IAM permissions are correct'
      ];
    } else if (error?.name === 'ResourceNotFoundException') {
      userMessage = 'Agent or alias not found. Please check the agent ID and alias ID.';
    } else if (error?.name === 'AccessDeniedException') {
      userMessage = 'Access denied. Please check AWS credentials and IAM permissions.';
    } else if (error?.name === 'ThrottlingException') {
      userMessage = 'Rate limit exceeded. Please retry after a moment.';
    }

    return NextResponse.json(
      {
        message: userMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        debugInfo
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Optional: Add GET method to check if the endpoint is working
export async function GET() {
  return NextResponse.json({
    message: 'Bedrock Agent API endpoint is active',
    agentId: process.env.BEDROCK_AGENT_ID || 'W2EFDETNXZ',
    region: process.env.AWS_REGION || 'ap-southeast-1'
  });
}
