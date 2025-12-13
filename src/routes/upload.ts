import { Elysia } from 'elysia';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!existsSync(UPLOAD_DIR)) {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export const uploadRoutes = new Elysia()
  .post('/api/upload', async ({ body }) => {
    try {
      const formData = body as any;
      const file = formData.file;
      
      if (!file) {
        return { error: 'No file provided' };
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
