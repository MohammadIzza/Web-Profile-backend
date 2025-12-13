import { Elysia } from 'elysia';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'elysia-rate-limit';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { loginSchema } from '../utils/validation';

// In-memory user store (for demo - production should use database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$YourHashedPasswordHere', // Will be set on first login
    email: 'admin@portfolio.com',
  }
];

// Rate limiter for login endpoint
const loginRateLimit = rateLimit({
  duration: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per 15 minutes
  generator: (req, server) => {
    // Use IP address as identifier
    return server?.requestIP(req)?.address || 'unknown';
  },
});

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(loginRateLimit)
  .post('/login', async ({ body, set }) => {
    try {
      // Validate input
      const validatedData = loginSchema.parse(body);
      const { username, password } = validatedData;

      // Find user (in production, query from database)
      const user = users.find(u => u.username === username);
      
      if (!user) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      // For first time, set password
      if (user.password === '$2a$10$YourHashedPasswordHere') {
        user.password = await bcrypt.hash('admin123', 10);
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      // Generate tokens
      const payload = {
        userId: user.id,
        username: user.username,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      };
    } catch (error: any) {
      console.error('Login error:', error);
      set.status = 400;
      
      if (error.errors) {
        // Zod validation errors
        return { 
          error: 'Validation failed', 
          details: error.errors.map((e: any) => e.message)
        };
      }
      
      return { error: 'Login failed' };
    }
  })

  .post('/refresh', async ({ body, set }) => {
    try {
      const { refreshToken } = body as { refreshToken: string };
      
      if (!refreshToken) {
        set.status = 400;
        return { error: 'Refresh token required' };
      }

      const { verifyToken } = await import('../utils/jwt');
      const payload = verifyToken(refreshToken);
      
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid refresh token' };
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({
        userId: payload.userId,
        username: payload.username,
      });

      return {
        success: true,
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      set.status = 401;
      return { error: 'Token refresh failed' };
    }
  })

  .post('/change-password', async ({ body, set }) => {
    try {
      const { username, oldPassword, newPassword } = body as {
        username: string;
        oldPassword: string;
        newPassword: string;
      };

      if (!username || !oldPassword || !newPassword) {
        set.status = 400;
        return { error: 'All fields required' };
      }

      if (newPassword.length < 6) {
        set.status = 400;
        return { error: 'Password must be at least 6 characters' };
      }

      const user = users.find(u => u.username === username);
      
      if (!user) {
        set.status = 404;
        return { error: 'User not found' };
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      
      if (!isValidPassword) {
        set.status = 401;
        return { error: 'Invalid old password' };
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      set.status = 500;
      return { error: 'Password change failed' };
    }
  })

  .get('/me', async ({ request, set }) => {
    try {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        set.status = 401;
        return { error: 'No token provided' };
      }

      const { extractToken, verifyToken } = await import('../utils/jwt');
      const token = extractToken(authHeader);
      
      if (!token) {
        set.status = 401;
        return { error: 'Invalid token format' };
      }

      const payload = verifyToken(token);
      
      if (!payload) {
        set.status = 401;
        return { error: 'Invalid or expired token' };
      }

      const user = users.find(u => u.id === payload.userId);
      
      if (!user) {
        set.status = 404;
        return { error: 'User not found' };
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Get user error:', error);
      set.status = 500;
      return { error: 'Failed to get user info' };
    }
  });
