const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isDevelopment = process.env.NODE_ENV !== 'production';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: 'uploads',
  jwtSecret: process.env.JWT_SECRET || '591bc01eeeb1675b7e158fweqwbev111o2nei1e12nepn129a8831a96fb19da10704596d802e337402c996f29b',
  cors: {
    // PAKAI FUNCTION biar header ACAO pasti ke-set sesuai Origin request
    origin: ({ request }: { request: Request }) => {
      const origin = request.headers.get('origin');
      if (!origin) return false;

      // allow localhost hanya di development
      if (isDevelopment && origin === 'http://localhost:5173') {
        return true;
      }

      // di production, hanya allow origins dari env variable
      if (!isDevelopment && allowedOrigins.length === 0) {
        console.warn('⚠️  CORS_ORIGIN not set in production - blocking all origins');
        return false;
      }

      // check allowed origins
      return allowedOrigins.includes(origin);
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // kamu pakai Bearer token (bukan cookie), jadi credentials ga perlu
    credentials: false,
    preflight: true,
  },
} as const;
