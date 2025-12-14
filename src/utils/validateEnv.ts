// Backend Environment Variables Validation

import { config } from '../config/env';

// Required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

// Validate environment variables on startup
export function validateEnv(): void {
  const missing: string[] = [];
  
  // Check required variables
  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL');
  }
  
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file.`
    );
  }
  
  // Warnings for defaults
  if (config.nodeEnv === 'production') {
    if (config.jwtSecret === 'your-secret-key-change-in-production') {
      throw new Error('CRITICAL: Cannot use default JWT_SECRET in production!');
    }
    
    if (!process.env.PORT) {
      console.warn('⚠️  WARNING: PORT not set, using default 3001');
    }
    
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN.trim() === '') {
      console.error('❌ ERROR: CORS_ORIGIN must be set in production!');
      console.error('   Set CORS_ORIGIN to your frontend URL (e.g., https://your-app.vercel.app)');
      throw new Error('CORS_ORIGIN is required in production');
    }
  }
  
  console.log('✅ Environment variables validated');
}
