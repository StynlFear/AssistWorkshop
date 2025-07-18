import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateOperationSchema } from '../../schemas'

// Get operation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const operation = await prisma.operation.findUnique({
      where: { id },
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
    
    if (!operation) {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 })
    }
    
    return NextResponse.json(operation)
  } catch (error) {
    console.error('Failed to fetch operation:', error)
    return NextResponse.json({ error: 'Failed to fetch operation' }, { status: 500 })
  }
}

// Update operation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateOperationSchema.parse(body)
    
    const operation = await prisma.operation.update({
      where: { id },
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
    
    return NextResponse.json(operation)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Operation ID already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update operation:', error)
    return NextResponse.json({ error: 'Failed to update operation' }, { status: 500 })
  }
}

// Delete operation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.operation.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Operation deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 })
    }
    console.error('Failed to delete operation:', error)
    return NextResponse.json({ error: 'Failed to delete operation' }, { status: 500 })
  }
}
