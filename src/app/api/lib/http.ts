import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export type RouteHandler = (request: Request) => Promise<Response>

export class AppError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'ValidationError', details: error.issues },
          { status: 400 }
        )
      }

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.code, message: error.message, details: error.details },
          { status: error.status }
        )
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json(
        { error: 'UpstreamError', message },
        { status: 502 }
      )
    }
  }
}


