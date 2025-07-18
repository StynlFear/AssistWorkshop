import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateChatMessageSchema } from '../../schemas'

// Get a single chat message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const message = await prisma.chatMessage.findUnique({
      where: { id },
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
    
    if (!message) {
      return NextResponse.json({ error: 'Chat message not found' }, { status: 404 })
    }
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Failed to fetch chat message:', error)
    return NextResponse.json({ error: 'Failed to fetch chat message' }, { status: 500 })
  }
}

// Update a chat message
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateChatMessageSchema.parse(body)
    
    const message = await prisma.chatMessage.update({
      where: { id },
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
    
    return NextResponse.json(message)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Chat message not found' }, { status: 404 })
    }
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid user or agent ID' }, { status: 400 })
    }
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    console.error('Failed to update chat message:', error)
    return NextResponse.json({ error: 'Failed to update chat message' }, { status: 500 })
  }
}

// Delete a chat message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.chatMessage.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Chat message deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Chat message not found' }, { status: 404 })
    }
    console.error('Failed to delete chat message:', error)
    return NextResponse.json({ error: 'Failed to delete chat message' }, { status: 500 })
  }
}
