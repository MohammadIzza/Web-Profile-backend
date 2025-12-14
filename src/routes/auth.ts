import { Elysia } from 'elysia';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'elysia-rate-limit';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { loginSchema } from '../utils/validation';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/login', { 
    beforeHandle: [
      async ({ request, set }) => {
        console.log('🟡 Rate limit check - Request method:', request.method);
        console.log('🟡 Rate limit check - Request URL:', request.url);
        console.log('🟡 Rate limit check - Origin:', request.headers.get('origin'));
      },
      rateLimit({
        duration: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 5 * 60 * 1000, // 15 min prod, 5 min dev
        max: process.env.NODE_ENV === 'production' ? 5 : 20, // 5 attempts prod, 20 attempts dev
        generator: (req, server) => {
          const ip = server?.requestIP(req)?.address || 'unknown';
          console.log('🟡 Rate limit generator - IP:', ip);
          return ip;
        },
        onLimitExceeded: ({ request, set }) => {
          console.log('🚫 Rate limit exceeded for:', request.url);
          set.status = 429;
          return { error: 'Too many requests. Please try again later.' };
        },
      })
    ]
  }, async ({ body, set, request }) => {
    console.log('🔵 POST /api/auth/login handler CALLED');
    console.log('📦 Request body type:', typeof body);
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    console.log('📦 Request headers:', Object.fromEntries(request.headers.entries()));
    
    try {
      // Validate input
      console.log('✅ Starting validation...');
      const validatedData = loginSchema.parse(body);
      console.log('✅ Validation passed:', { username: validatedData.username });
      const { username, password } = validatedData;

      // Find user from database
      console.log('🔍 Searching for user:', username);
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        console.log('❌ User not found:', username);
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      console.log('✅ User found:', { id: user.id, username: user.username });

      // Verify password
      console.log('🔐 Verifying password...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      console.log('✅ Password verified');

      // Generate tokens
      console.log('🎫 Generating tokens...');
      const payload = {
        userId: user.id,
        username: user.username,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      console.log('✅ Tokens generated successfully');
      console.log('📤 Returning response...');

      const response = {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      };

      console.log('✅ Response prepared:', { 
        success: response.success, 
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
        user: response.user 
      });

      return response;
    } catch (error: any) {
      console.error('❌ Login error occurred:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      set.status = 400;
      
      if (error.errors) {
        // Zod validation errors
        console.log('⚠️ Zod validation errors:', error.errors);
        return { 
          error: 'Validation failed', 
          details: error.errors.map((e: any) => e.message)
        };
      }
      
      return { error: 'Login failed', details: error?.message || 'Unknown error' };
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

      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        set.status = 404;
        return { error: 'User not found' };
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      
      if (!isValidPassword) {
        set.status = 401;
        return { error: 'Invalid old password' };
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

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

      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });
      
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
