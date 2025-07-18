import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSystemComponentSchema, updateSystemComponentSchema } from '../schemas'

// List all system components
export async function GET() {
  try {
    const components = await prisma.systemComponent.findMany({
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
    return NextResponse.json(components)
  } catch (error) {
    console.error('Failed to fetch system components:', error)
    return NextResponse.json({ error: 'Failed to fetch system components' }, { status: 500 })
  }
}

// Create system component
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createSystemComponentSchema.parse(body)
    
    const component = await prisma.systemComponent.create({
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
    
    return NextResponse.json(component, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'System component name already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create system component:', error)
    return NextResponse.json({ error: 'Failed to create system component' }, { status: 500 })
  }
}
