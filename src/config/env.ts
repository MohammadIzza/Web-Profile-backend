const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

console.log('🔒 CORS Configuration on startup:');
console.log('  CORS_ORIGIN env:', process.env.CORS_ORIGIN || '(not set)');
console.log('  Parsed allowed origins:', corsOrigins);
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');

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
      console.log('🌐 CORS origin check:', origin);
      console.log('🌐 CORS allowed origins:', corsOrigins);
      
      if (!origin) {
        console.log('✅ CORS: No origin header, allowing (same-origin)');
        return true; // allow direct access / curl / same-origin
      }
      
      const isAllowed = corsOrigins.includes(origin);
      console.log(`🌐 CORS: ${isAllowed ? '✅ ALLOWED' : '❌ BLOCKED'} - ${origin}`);
      
      return isAllowed;
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],

    // kamu pakai Bearer token, bukan cookie → jangan pakai credentials
    credentials: false,
    preflight: true,
  },
} as const;
