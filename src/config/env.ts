export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: 'uploads',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
} as const;
