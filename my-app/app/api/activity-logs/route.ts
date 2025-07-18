import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createActivityLogSchema } from '../schemas'

// List all activity logs
export async function GET() {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch activity logs:', error)
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 })
  }
}

// Create activity log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createActivityLogSchema.parse(body)
    
    const log = await prisma.activityLog.create({
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    return NextResponse.json(log, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create activity log:', error)
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 })
  }
}
