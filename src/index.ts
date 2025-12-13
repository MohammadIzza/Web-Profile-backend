import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { config } from './config/env';
import { validateEnv } from './utils/validateEnv';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profile';
import { portfolioRoutes } from './routes/portfolio';
import { blogRoutes } from './routes/blog';
import { experienceRoutes } from './routes/experience';
import { techstackRoutes } from './routes/techstack';
import { uploadRoutes } from './routes/upload';

validateEnv();

const app = new Elysia()
  .use(cors(config.cors))
  .use(requestLogger)
  .use(errorHandler)
  .use(authRoutes)
  .use(uploadRoutes)
  .use(profileRoutes)
  .use(portfolioRoutes)
  .use(blogRoutes)
  .use(experienceRoutes)
  .use(techstackRoutes);

app.get('/', () => ({ ok: true, service: 'web-profile-backend' }));
app.get('/health', () => 'ok');

app.listen(config.port);

console.log(`🚀 Backend running on port ${config.port}`);
