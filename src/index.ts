import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = new Elysia();

// Create uploads directory if it doesn't exist
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  await mkdir(uploadsDir, { recursive: true });
}

app.use(cors());

// Serve static files from uploads directory
app.get('/uploads/*', async ({ params }) => {
  const filePath = join(uploadsDir, params['*'] || '');
  try {
    const file = Bun.file(filePath);
    return new Response(file);
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
});

// ===== UPLOAD ROUTE =====
app.post('/api/upload', async ({ body }) => {
  try {
    const formData = body as any;
    const file = formData.file;
    
    if (!file) {
      return { error: 'No file uploaded' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    await writeFile(filepath, await file.arrayBuffer());

    // Return URL
    return {
      url: `/uploads/${filename}`,
      filename: filename
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Upload failed' };
  }
});

// ===== PROFILE ROUTES =====
app.get('/api/profile', async () => {
  const profiles = await prisma.profile.findMany();
  return profiles;
});

app.get('/api/profile/:id', async ({ params }) => {
  const profile = await prisma.profile.findUnique({
    where: { id: Number(params.id) }
  });
  return profile;
});

app.post('/api/profile', async ({ body }) => {
  const profile = await prisma.profile.create({
    data: body as any
  });
  return profile;
});

app.put('/api/profile/:id', async ({ params, body }) => {
  const profile = await prisma.profile.update({
    where: { id: Number(params.id) },
    data: body as any
  });
  return profile;
});

app.delete('/api/profile/:id', async ({ params }) => {
  await prisma.profile.delete({
    where: { id: Number(params.id) }
  });
  return { message: 'Profile deleted' };
});

// ===== PORTFOLIO ROUTES =====
app.get('/api/portfolio', async () => {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return portfolios;
});

app.get('/api/portfolio/:id', async ({ params }) => {
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: Number(params.id) }
  });
  return portfolio;
});

app.post('/api/portfolio', async ({ body }) => {
  const portfolio = await prisma.portfolio.create({
    data: body as any
  });
  return portfolio;
});

app.put('/api/portfolio/:id', async ({ params, body }) => {
  const portfolio = await prisma.portfolio.update({
    where: { id: Number(params.id) },
    data: body as any
  });
  return portfolio;
});

app.delete('/api/portfolio/:id', async ({ params }) => {
  await prisma.portfolio.delete({
    where: { id: Number(params.id) }
  });
  return { message: 'Portfolio deleted' };
});

// ===== BLOG ROUTES =====
app.get('/api/blog', async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return blogs;
});

app.get('/api/blog/:id', async ({ params }) => {
  const blog = await prisma.blog.findUnique({
    where: { id: Number(params.id) }
  });
  return blog;
});

app.post('/api/blog', async ({ body }) => {
  const blog = await prisma.blog.create({
    data: body as any
  });
  return blog;
});

app.put('/api/blog/:id', async ({ params, body }) => {
  const blog = await prisma.blog.update({
    where: { id: Number(params.id) },
    data: body as any
  });
  return blog;
});

app.delete('/api/blog/:id', async ({ params }) => {
  await prisma.blog.delete({
    where: { id: Number(params.id) }
  });
  return { message: 'Blog deleted' };
});

// ===== EXPERIENCE ROUTES =====
app.get('/api/experience', async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: 'desc' }
  });
  return experiences;
});

app.get('/api/experience/:id', async ({ params }) => {
  const experience = await prisma.experience.findUnique({
    where: { id: Number(params.id) }
  });
  return experience;
});

app.post('/api/experience', async ({ body }) => {
  const experience = await prisma.experience.create({
    data: body as any
  });
  return experience;
});

app.put('/api/experience/:id', async ({ params, body }) => {
  const experience = await prisma.experience.update({
    where: { id: Number(params.id) },
    data: body as any
  });
  return experience;
});

app.delete('/api/experience/:id', async ({ params }) => {
  await prisma.experience.delete({
    where: { id: Number(params.id) }
  });
  return { message: 'Experience deleted' };
});

// ===== TECH STACK ROUTES =====
app.get('/api/techstack', async () => {
  const techstacks = await prisma.techStack.findMany({
    orderBy: { category: 'asc' }
  });
  return techstacks;
});

app.get('/api/techstack/:id', async ({ params }) => {
  const techstack = await prisma.techStack.findUnique({
    where: { id: Number(params.id) }
  });
  return techstack;
});

app.post('/api/techstack', async ({ body }) => {
  const techstack = await prisma.techStack.create({
    data: body as any
  });
  return techstack;
});

app.put('/api/techstack/:id', async ({ params, body }) => {
  const techstack = await prisma.techStack.update({
    where: { id: Number(params.id) },
    data: body as any
  });
  return techstack;
});

app.delete('/api/techstack/:id', async ({ params }) => {
  await prisma.techStack.delete({
    where: { id: Number(params.id) }
  });
  return { message: 'Tech stack deleted' };
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);

console.log(`🚀 Backend running on http://localhost:${PORT}`);