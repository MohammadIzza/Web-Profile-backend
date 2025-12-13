import { Elysia } from 'elysia';
import { verifyToken, extractToken } from '../utils/jwt';

export const authMiddleware = new Elysia()
  .derive(({ request, set }) => {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader || undefined);
    
    if (!token) {
      set.status = 401;
      throw new Error('No token provided');
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      set.status = 401;
      throw new Error('Invalid or expired token');
    }

    return {
      user: payload,
    };
  });

// Optional auth - doesn't throw error if no token
export const optionalAuth = new Elysia()
  .derive(({ request }) => {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader || undefined);
    
    if (!token) {
      return { user: null };
    }

    const payload = verifyToken(token);
    
    return {
      user: payload,
    };
  });
