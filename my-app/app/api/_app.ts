import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'

const app = new Hono()

// Global middleware
app.use('*', cors())
app.use('*', async (c, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export const config = {
  runtime: 'edge'
}

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)

export default app
