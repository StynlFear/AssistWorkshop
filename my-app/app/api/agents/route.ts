import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createAgentSchema, updateAgentSchema } from '../schemas'

const app = new Hono().basePath('/api/agents')

// List all agents
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const agents = await prisma.agent.findMany()
    return c.json(agents)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch agents' })
  }
})

// Get agent by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        operations: true,
        activityLogs: true,
        chatMessages: true
      }
    })
    if (!agent) {
      throw new HTTPException(404, { message: 'Agent not found' })
    }
    return c.json(agent)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch agent' })
  }
})

// Create agent
app.post('/', zValidator('json', createAgentSchema), async (c) => {
  try {
    const data = await c.req.json()
    const agent = await prisma.agent.create({
      data
    })
    return c.json(agent, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Agent ID or codename already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to create agent' })
  }
})

// Update agent
app.put('/:id', zValidator('json', updateAgentSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const agent = await prisma.agent.update({
      where: { id },
      data
    })
    return c.json(agent)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Agent not found' })
    }
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Agent ID or codename already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to update agent' })
  }
})

// Delete agent
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.agent.delete({
      where: { id }
    })
    return c.json({ message: 'Agent deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Agent not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete agent' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
