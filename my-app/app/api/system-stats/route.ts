import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createSystemStatsSchema, updateSystemStatsSchema } from '../schemas'

const app = new Hono().basePath('/api/system-stats')

// List all system stats
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const stats = await prisma.systemStats.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return c.json(stats)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch system stats' })
  }
})

// Get system stats by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const stats = await prisma.systemStats.findUnique({
      where: { id }
    })
    if (!stats) {
      throw new HTTPException(404, { message: 'System stats not found' })
    }
    return c.json(stats)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch system stats' })
  }
})

// Create system stats
app.post('/', zValidator('json', createSystemStatsSchema), async (c) => {
  try {
    const data = await c.req.json()
    const stats = await prisma.systemStats.create({
      data
    })
    return c.json(stats, 201)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to create system stats' })
  }
})

// Update system stats
app.put('/:id', zValidator('json', updateSystemStatsSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const stats = await prisma.systemStats.update({
      where: { id },
      data
    })
    return c.json(stats)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'System stats not found' })
    }
    throw new HTTPException(500, { message: 'Failed to update system stats' })
  }
})

// Delete system stats
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.systemStats.delete({
      where: { id }
    })
    return c.json({ message: 'System stats deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'System stats not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete system stats' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
