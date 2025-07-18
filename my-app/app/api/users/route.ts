import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/lib/prisma'
import { createUserSchema, updateUserSchema } from '../schemas'

const app = new Hono().basePath('/api/users')

// List all users
app.get('/', async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return c.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new HTTPException(500, { message: 'Failed to fetch users' })
  }
})

// Get user by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' })
    }
    
    return c.json(user)
  } catch (error) {
    if (error instanceof HTTPException) throw error
    console.error('Failed to fetch user:', error)
    throw new HTTPException(500, { message: 'Failed to fetch user' })
  }
})

// Create user
app.post('/', zValidator('json', createUserSchema), async (c) => {
  try {
    const data = await c.req.json()
    
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return c.json(user, 201)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Email or username already exists' })
    }
    console.error('Failed to create user:', error)
    throw new HTTPException(500, { message: 'Failed to create user' })
  }
})

// Update user
app.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return c.json(user)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'User not found' })
    }
    if (error?.code === 'P2002') {
      throw new HTTPException(400, { message: 'Email or username already exists' })
    }
    console.error('Failed to update user:', error)
    throw new HTTPException(500, { message: 'Failed to update user' })
  }
})

// Delete user
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    await prisma.user.delete({
      where: { id }
    })
    
    return c.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new HTTPException(404, { message: 'User not found' })
    }
    console.error('Failed to delete user:', error)
    throw new HTTPException(500, { message: 'Failed to delete user' })
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
