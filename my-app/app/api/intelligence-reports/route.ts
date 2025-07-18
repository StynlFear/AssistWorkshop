import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createIntelligenceReportSchema, updateIntelligenceReportSchema } from '../schemas'

const app = new Hono()

// List all intelligence reports
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const reports = await prisma.intelligenceReport.findMany({
      include: {
        operation: true,
        activityLogs: true
      }
    })
    return c.json(reports)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch intelligence reports' })
  }
})

// Get intelligence report by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const report = await prisma.intelligenceReport.findUnique({
      where: { id },
      include: {
        operation: true,
        activityLogs: true
      }
    })
    if (!report) {
      throw new HTTPException(404, { message: 'Intelligence report not found' })
    }
    return c.json(report)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch intelligence report' })
  }
})

// Create intelligence report
app.post('/', zValidator('json', createIntelligenceReportSchema), async (c) => {
  try {
    const data = await c.req.json()
    const report = await prisma.intelligenceReport.create({
      data,
      include: {
        operation: true
      }
    })
    return c.json(report, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Report ID already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to create intelligence report' })
  }
})

// Update intelligence report
app.put('/:id', zValidator('json', updateIntelligenceReportSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const report = await prisma.intelligenceReport.update({
      where: { id },
      data,
      include: {
        operation: true
      }
    })
    return c.json(report)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Intelligence report not found' })
    }
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Report ID already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to update intelligence report' })
  }
})

// Delete intelligence report
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.intelligenceReport.delete({
      where: { id }
    })
    return c.json({ message: 'Intelligence report deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Intelligence report not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete intelligence report' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
