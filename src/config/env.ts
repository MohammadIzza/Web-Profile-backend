const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: 'uploads',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  cors: {
    // ✅ gunakan headers.origin (lebih aman daripada request.headers)
    origin: ({ headers }: any) => {
      const origin = headers?.origin; // string | undefined
      if (!origin) return true; // allow direct access / curl / same-origin
      return corsOrigins.includes(origin);
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],

    // kamu pakai Bearer token, bukan cookie → jangan pakai credentials
    credentials: false,
    preflight: true,
  },
} as const;
