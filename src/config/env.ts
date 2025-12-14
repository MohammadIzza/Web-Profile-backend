const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isDevelopment = process.env.NODE_ENV !== 'production';

// Log CORS config on startup
console.log('🔒 CORS Configuration:');
console.log('  Environment:', isDevelopment ? 'development' : 'production');
console.log('  Allowed Origins:', allowedOrigins.length > 0 ? allowedOrigins : 'NONE (will block all)');

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
      
      // Log untuk debugging
      if (origin) {
        console.log(`🌐 CORS check - Origin: ${origin}`);
      }

      if (!origin) {
        console.log('❌ CORS: No origin header');
        return false;
      }

      // allow localhost hanya di development
      if (isDevelopment && origin === 'http://localhost:5173') {
        console.log('✅ CORS: Allowed (localhost in dev)');
        return true;
      }

      // di production, hanya allow origins dari env variable
      if (!isDevelopment && allowedOrigins.length === 0) {
        console.warn('⚠️  CORS_ORIGIN not set in production - blocking all origins');
        return false;
      }

      // check allowed origins
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        console.log(`✅ CORS: Allowed - ${origin}`);
      } else {
        console.log(`❌ CORS: Blocked - ${origin} (not in allowed list)`);
        console.log(`   Allowed origins:`, allowedOrigins);
      }
      
      return isAllowed;
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // kamu pakai Bearer token (bukan cookie), jadi credentials ga perlu
    credentials: false,
    preflight: true,
  },
} as const;
