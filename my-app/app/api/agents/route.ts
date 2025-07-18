import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAgentSchema, updateAgentSchema } from '../schemas'

// List all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
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
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// Create agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createAgentSchema.parse(body)
    
    const agent = await prisma.agent.create({
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
    
    return NextResponse.json(agent, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Agent ID or codename already exists' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
