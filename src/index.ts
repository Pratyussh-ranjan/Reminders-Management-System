import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => c.text('Hello, Hono!'));

// ✅ Correct way to use serve()
serve({
  fetch: app.fetch,
  port: 3000
});

console.log('Server is running on http://localhost:3000');
