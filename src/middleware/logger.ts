import { Elysia } from 'elysia';

export const requestLogger = new Elysia()
  .onRequest(({ request }) => {
    const timestamp = new Date().toISOString();
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    console.log(`[${timestamp}] ${request.method} ${url.pathname}${origin ? ` | Origin: ${origin}` : ''}`);
  });
