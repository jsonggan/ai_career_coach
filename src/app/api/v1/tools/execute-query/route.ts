import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const { query, params = [] } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Execute raw SQL query with parameters
    const result = await prisma.$queryRawUnsafe(query, ...params)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
    
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json(
      { error: 'Database query failed' }, 
      { status: 500 }
    )
  }
}
