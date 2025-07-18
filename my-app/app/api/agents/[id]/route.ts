import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateAgentSchema } from '../../schemas'

// Get agent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        agentId: true,
        codename: true,
        realName: true,
        status: true,
        location: true,
        riskLevel: true,
        missionCount: true,
        lastSeen: true,
        isActive: true,
        skills: true,
        clearanceLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    
    return NextResponse.json(agent)
  } catch (error) {
    console.error('Failed to fetch agent:', error)
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
  }
}

// Update agent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateAgentSchema.parse(body)
    
    const agent = await prisma.agent.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        agentId: true,
        codename: true,
        realName: true,
        status: true,
        location: true,
        riskLevel: true,
        missionCount: true,
        lastSeen: true,
        isActive: true,
        skills: true,
        clearanceLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(agent)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Agent ID or codename already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update agent:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}

// Delete agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.agent.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    console.error('Failed to delete agent:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
