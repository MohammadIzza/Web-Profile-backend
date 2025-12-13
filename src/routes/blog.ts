import { Elysia } from 'elysia';
import { prisma } from '../config/database';

export const blogRoutes = new Elysia({ prefix: '/api/blog' })
  .get('/', async () => {
    try {
      const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return blogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return { error: 'Failed to fetch blogs' };
    }
  })
  
  .get('/:id', async ({ params }) => {
    try {
      const blog = await prisma.blog.findUnique({
        where: { id: Number(params.id) }
      });
      
      if (!blog) {
        return { error: 'Blog not found' };
      }
      
      return blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return { error: 'Failed to fetch blog' };
    }
  })
  
  .post('/', async ({ body }) => {
    try {
      const blog = await prisma.blog.create({
        data: body as any
      });
      return blog;
    } catch (error) {
      console.error('Error creating blog:', error);
      return { error: 'Failed to create blog' };
    }
  })
  
  .put('/:id', async ({ params, body }) => {
    try {
      const blog = await prisma.blog.update({
        where: { id: Number(params.id) },
        data: body as any
      });
      return blog;
    } catch (error) {
      console.error('Error updating blog:', error);
      return { error: 'Failed to update blog' };
    }
  })
  
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.blog.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Blog deleted successfully' };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return { error: 'Failed to delete blog' };
    }
  });
