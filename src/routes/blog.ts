import { Elysia } from 'elysia';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { blogSchema } from '../utils/validation';

export const blogRoutes = new Elysia({ prefix: '/api/blog' })
  .get('', async () => {
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
  
  .use(authMiddleware)
  
  .post('', async ({ body, set }) => {
    try {
      const validatedData = blogSchema.parse(body);
      
      // Generate slug from title if not provided
      let slug = validatedData.slug;
      if (!slug && validatedData.title) {
        slug = validatedData.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        
        // Ensure slug is unique
        let uniqueSlug = slug;
        let counter = 1;
        while (await prisma.blog.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        }
        slug = uniqueSlug;
      }
      
      const blog = await prisma.blog.create({
        data: {
          ...validatedData,
          slug: slug || `blog-${Date.now()}`
        }
      });
      return blog;
    } catch (error: any) {
      console.error('Error creating blog:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to create blog' };
    }
  })
  
  .put('/:id', async ({ params, body, set }) => {
    try {
      const validatedData = blogSchema.partial().parse(body);
      
      // Generate slug if title is updated but slug is not provided
      let updateData: any = { ...validatedData };
      if (validatedData.title && !validatedData.slug) {
        const existingBlog = await prisma.blog.findUnique({
          where: { id: Number(params.id) }
        });
        
        if (existingBlog && existingBlog.title !== validatedData.title) {
          let slug = validatedData.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          
          // Ensure slug is unique (excluding current blog)
          let uniqueSlug = slug;
          let counter = 1;
          while (await prisma.blog.findFirst({ 
            where: { 
              slug: uniqueSlug,
              id: { not: Number(params.id) }
            } 
          })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
          }
          updateData.slug = uniqueSlug;
        }
      }
      
      const blog = await prisma.blog.update({
        where: { id: Number(params.id) },
        data: updateData
      });
      return blog;
    } catch (error: any) {
      console.error('Error updating blog:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to update blog' };
    }
  })
  
  .delete('/:id', async ({ params, set }) => {
    try {
      await prisma.blog.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Blog deleted successfully' };
    } catch (error) {
      console.error('Error deleting blog:', error);
      set.status = 500;
      return { error: 'Failed to delete blog' };
    }
  });
