import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createSystemComponentSchema, updateSystemComponentSchema } from '../schemas'

const app = new Hono()

// List all system components
export const GET = handle(app)
app.get('/', async (c) => {
  try {
    const components = await prisma.systemComponent.findMany({
      include: {
        activityLogs: true
      }
    })
    return c.json(components)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch system components' })
  }
})

// Get system component by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const component = await prisma.systemComponent.findUnique({
      where: { id },
      include: {
        activityLogs: true
      }
    })
    if (!component) {
      throw new HTTPException(404, { message: 'System component not found' })
    }
    return c.json(component)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch system component' })
  }
})

// Create system component
app.post('/', zValidator('json', createSystemComponentSchema), async (c) => {
  try {
    const data = await c.req.json()
    const component = await prisma.systemComponent.create({
      data
    })
    return c.json(component, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Component name already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to create system component' })
  }
})

// Update system component
app.put('/:id', zValidator('json', updateSystemComponentSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const component = await prisma.systemComponent.update({
      where: { id },
      data
    })
    return c.json(component)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'System component not found' })
    }
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Component name already exists' })
    }
    throw new HTTPException(500, { message: 'Failed to update system component' })
  }
})

// Delete system component
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.systemComponent.delete({
      where: { id }
    })
    return c.json({ message: 'System component deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'System component not found' })
    }
    throw new HTTPException(500, { message: 'Failed to delete system component' })
  }
})

export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
