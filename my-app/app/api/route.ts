import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { app as usersApp } from './users/route'

const app = new Hono()

// Mount routes
app.route('/users', usersApp)

// Export handlers for Next.js App Router
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
