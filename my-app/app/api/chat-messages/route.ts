import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createChatMessageSchema, updateChatMessageSchema } from '../schemas'

const app = new Hono()

// List all chat messages
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      include: {
        sender: true,
        agent: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    return c.json(messages)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch chat messages' })
  }
})

// Get chat message by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      include: {
        sender: true,
        agent: true
      }
    })
    if (!message) {
      throw new HTTPException(404, { message: 'Chat message not found' })
    }
    return c.json(message)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch chat message' })
  }
})

// Create chat message
app.post('/', zValidator('json', createChatMessageSchema), async (c) => {
  try {
    const data = await c.req.json()
    const message = await prisma.chatMessage.create({
      data,
      include: {
        sender: true,
        agent: true
      }
    })
    return c.json(message, 201)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to create chat message' })
  }
})

// Update chat message
app.put('/:id', zValidator('json', updateChatMessageSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const message = await prisma.chatMessage.update({
      where: { id },
      data,
      include: {
        sender: true,
        agent: true
      }
    })
    return c.json(message)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Chat message not found' })
    }
    throw new HTTPException(500, { message: 'Failed to update chat message' })
  }
})

// Delete chat message
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.chatMessage.delete({
      where: { id }
    })
    return c.json({ message: 'Chat message deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Chat message not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete chat message' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
