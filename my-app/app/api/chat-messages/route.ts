import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createChatMessageSchema } from '../schemas'

// List all chat messages
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const channelId = url.searchParams.get('channelId')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    const whereClause = channelId ? { channelId } : {}
    
    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        agent: {
          select: {
            id: true,
            agentId: true,
            codename: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch chat messages:', error)
    return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 })
  }
}

// Create chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createChatMessageSchema.parse(body)
    
    const message = await prisma.chatMessage.create({
      data: validatedData,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        agent: {
          select: {
            id: true,
            agentId: true,
            codename: true
          }
        }
      }
    })
    
    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid user or agent ID' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create chat message:', error)
    return NextResponse.json({ error: 'Failed to create chat message' }, { status: 500 })
  }
}
