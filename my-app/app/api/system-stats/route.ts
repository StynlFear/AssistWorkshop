import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSystemStatsSchema, updateSystemStatsSchema } from '../schemas'

// List all system stats
export async function GET() {
  try {
    const stats = await prisma.systemStats.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch system stats:', error)
    return NextResponse.json({ error: 'Failed to fetch system stats' }, { status: 500 })
  }
}

// Create system stats
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createSystemStatsSchema.parse(body)
    
    const stats = await prisma.systemStats.create({
      data: validatedData
    })
    
    return NextResponse.json(stats, { status: 201 })
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create system stats:', error)
    return NextResponse.json({ error: 'Failed to create system stats' }, { status: 500 })
  }
}
