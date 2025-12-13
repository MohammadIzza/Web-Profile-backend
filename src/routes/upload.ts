import { Elysia } from 'elysia';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { authMiddleware } from '../middleware/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!existsSync(UPLOAD_DIR)) {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export const uploadRoutes = new Elysia()
  .use(authMiddleware)
  .post('/api/upload', async ({ body, set }) => {
    try {
      const formData = body as any;
      const file = formData.file;
      
      if (!file) {
        set.status = 400;
        return { error: 'No file provided' };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        set.status = 400;
        return { error: 'Invalid file type. Only images are allowed' };
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        set.status = 400;
        return { error: 'File too large. Maximum size is 5MB' };
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      await Bun.write(filePath, file);
      
      return { 
        url: `/uploads/${fileName}`,
        fileName 
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      set.status = 500;
      return { error: 'Failed to upload file' };
    }
  })
  .get('/uploads/:file', async ({ params }) => {
    try {
      const filePath = path.join(UPLOAD_DIR, params.file);
      const file = Bun.file(filePath);
      
      if (!await file.exists()) {
        return new Response('File not found', { status: 404 });
      }
      
      return file;
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Error serving file', { status: 500 });
    }
  });
