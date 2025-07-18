import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateSystemComponentSchema } from '../../schemas'

// Get a single system component
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const component = await prisma.systemComponent.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        status: true,
        location: true,
        health: true,
        cpuUsage: true,
        memoryUsage: true,
        storageUsage: true,
        uptime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!component) {
      return NextResponse.json({ error: 'System component not found' }, { status: 404 })
    }
    
    return NextResponse.json(component)
  } catch (error) {
    console.error('Failed to fetch system component:', error)
    return NextResponse.json({ error: 'Failed to fetch system component' }, { status: 500 })
  }
}

// Update a system component
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateSystemComponentSchema.parse(body)
    
    const component = await prisma.systemComponent.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        role: true,
        status: true,
        location: true,
        health: true,
        cpuUsage: true,
        memoryUsage: true,
        storageUsage: true,
        uptime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(component)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'System component not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'System component name already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update system component:', error)
    return NextResponse.json({ error: 'Failed to update system component' }, { status: 500 })
  }
}

// Delete a system component
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.systemComponent.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'System component deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'System component not found' }, { status: 404 })
    }
    console.error('Failed to delete system component:', error)
    return NextResponse.json({ error: 'Failed to delete system component' }, { status: 500 })
  }
}
