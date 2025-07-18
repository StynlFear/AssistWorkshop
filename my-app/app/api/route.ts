import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { usersRouter } from './users/route';

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api');

// Routes
app.route('/users', usersRouter);

export default handle(app);
