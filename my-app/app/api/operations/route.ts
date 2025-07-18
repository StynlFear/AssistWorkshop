import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createOperationSchema, updateOperationSchema } from '../schemas'

const app = new Hono().basePath('/api/operations')

// List all operations
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const operations = await prisma.operation.findMany({
      include: {
        agents: {
          include: {
            agent: true
          }
        },
        activityLogs: true,
        reports: true
      }
    })
    return c.json(operations)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch operations' })
  }
})

// Get operation by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const operation = await prisma.operation.findUnique({
      where: { id },
      include: {
        agents: {
          include: {
            agent: true
          }
        },
        activityLogs: true,
        reports: true
      }
    })
    if (!operation) {
      throw new HTTPException(404, { message: 'Operation not found' })
    }
    return c.json(operation)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch operation' })
  }
})

// Create operation
app.post('/', zValidator('json', createOperationSchema), async (c) => {
  try {
    const data = await c.req.json()
    const operation = await prisma.operation.create({
      data,
      include: {
        agents: true
      }
    })
    return c.json(operation, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Operation ID already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to create operation' })
  }
})

// Update operation
app.put('/:id', zValidator('json', updateOperationSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const operation = await prisma.operation.update({
      where: { id },
      data,
      include: {
        agents: true
      }
    })
    return c.json(operation)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Operation not found' })
    }
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Operation ID already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to update operation' })
  }
})

// Delete operation
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.operation.delete({
      where: { id }
    })
    return c.json({ message: 'Operation deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'Operation not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete operation' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
