import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createIntelligenceReportSchema, updateIntelligenceReportSchema } from '../schemas'

// List all intelligence reports
export async function GET() {
  try {
    const reports = await prisma.intelligenceReport.findMany({
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
    return NextResponse.json(reports)
  } catch (error) {
    console.error('Failed to fetch intelligence reports:', error)
    return NextResponse.json({ error: 'Failed to fetch intelligence reports' }, { status: 500 })
  }
}

// Create intelligence report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createIntelligenceReportSchema.parse(body)
    
    const report = await prisma.intelligenceReport.create({
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
    
    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Report ID already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create intelligence report:', error)
    return NextResponse.json({ error: 'Failed to create intelligence report' }, { status: 500 })
  }
}
