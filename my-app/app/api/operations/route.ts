import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOperationSchema, updateOperationSchema } from '../schemas'

// List all operations
export async function GET() {
  try {
    const operations = await prisma.operation.findMany({
      select: {
        id: true,
        operationId: true,
        name: true,
        description: true,
        status: true,
        riskLevel: true,
        location: true,
        startDate: true,
        endDate: true,
        plannedEndDate: true,
        isActive: true,
        briefing: true,
        objectives: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return NextResponse.json(operations)
  } catch (error) {
    console.error('Failed to fetch operations:', error)
    return NextResponse.json({ error: 'Failed to fetch operations' }, { status: 500 })
  }
}

// Create operation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createOperationSchema.parse(body)
    
    const operation = await prisma.operation.create({
      data: validatedData,
      select: {
        id: true,
        operationId: true,
        name: true,
        description: true,
        status: true,
        riskLevel: true,
        location: true,
        startDate: true,
        endDate: true,
        plannedEndDate: true,
        isActive: true,
        briefing: true,
        objectives: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(operation, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Operation ID already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create operation:', error)
    return NextResponse.json({ error: 'Failed to create operation' }, { status: 500 })
  }
}
