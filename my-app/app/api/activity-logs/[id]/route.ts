import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get a single activity log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const log = await prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        },
        agent: {
          select: {
            id: true,
            agentId: true,
            codename: true
          }
        },
        operation: {
          select: {
            id: true,
            operationId: true,
            name: true
          }
        },
        report: {
          select: {
            id: true,
            reportId: true,
            title: true
          }
        },
        system: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })
    
    if (!log) {
      return NextResponse.json({ error: 'Activity log not found' }, { status: 404 })
    }
    
    return NextResponse.json(log)
  } catch (error) {
    console.error('Failed to fetch activity log:', error)
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 })
  }
}

// Delete an activity log
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.activityLog.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Activity log deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Activity log not found' }, { status: 404 })
    }
    console.error('Failed to delete activity log:', error)
    return NextResponse.json({ error: 'Failed to delete activity log' }, { status: 500 })
  }
}
