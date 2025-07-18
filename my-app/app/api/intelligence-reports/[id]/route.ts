import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateIntelligenceReportSchema } from '../../schemas'

// Get intelligence report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await prisma.intelligenceReport.findUnique({
      where: { id },
      select: {
        id: true,
        reportId: true,
        title: true,
        description: true,
        content: true,
        classification: true,
        type: true,
        location: true,
        tags: true,
        sourceId: true,
        operationId: true,
        threatLevel: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!report) {
      return NextResponse.json({ error: 'Intelligence report not found' }, { status: 404 })
    }
    
    return NextResponse.json(report)
  } catch (error) {
    console.error('Failed to fetch intelligence report:', error)
    return NextResponse.json({ error: 'Failed to fetch intelligence report' }, { status: 500 })
  }
}

// Update intelligence report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateIntelligenceReportSchema.parse(body)
    
    const report = await prisma.intelligenceReport.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        reportId: true,
        title: true,
        description: true,
        content: true,
        classification: true,
        type: true,
        location: true,
        tags: true,
        sourceId: true,
        operationId: true,
        threatLevel: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(report)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Intelligence report not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Report ID already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update intelligence report:', error)
    return NextResponse.json({ error: 'Failed to update intelligence report' }, { status: 500 })
  }
}

// Delete intelligence report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.intelligenceReport.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Intelligence report deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Intelligence report not found' }, { status: 404 })
    }
    console.error('Failed to delete intelligence report:', error)
    return NextResponse.json({ error: 'Failed to delete intelligence report' }, { status: 500 })
  }
}
