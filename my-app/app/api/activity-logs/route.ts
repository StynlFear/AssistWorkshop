import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createActivityLogSchema, updateActivityLogSchema } from '../schemas'

const app = new Hono()

// List all activity logs
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: true,
        agent: true,
        operation: true,
        report: true,
        system: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    return c.json(logs)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch activity logs' })
  }
})

// Get activity log by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const log = await prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: true,
        agent: true,
        operation: true,
        report: true,
        system: true
      }
    })
    if (!log) {
      throw new HTTPException(404, { message: 'Activity log not found' })
    }
    return c.json(log)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch activity log' })
  }
})

// Create activity log
app.post('/', zValidator('json', createActivityLogSchema), async (c) => {
  try {
    const data = await c.req.json()
    const log = await prisma.activityLog.create({
      data,
      include: {
        user: true,
        agent: true,
        operation: true,
        report: true,
        system: true
      }
    })
    return c.json(log, 201)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to create activity log' })
  }
})

// Update activity log
app.put('/:id', zValidator('json', updateActivityLogSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const log = await prisma.activityLog.update({
      where: { id },
      data,
      include: {
        user: true,
        agent: true,
        operation: true,
        report: true,
        system: true
      }
    })
    return c.json(log)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Activity log not found' })
    }
    throw new HTTPException(500, { message: 'Failed to update activity log' })
  }
})

// Delete activity log
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.activityLog.delete({
      where: { id }
    })
    return c.json({ message: 'Activity log deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Activity log not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete activity log' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
