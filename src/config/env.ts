export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: 'uploads',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
} as const;
