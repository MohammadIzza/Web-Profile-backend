import { Elysia } from 'elysia';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { techStackSchema } from '../utils/validation';

export const techstackRoutes = new Elysia({ prefix: '/api/techstack' })
  .get('', async () => {
    try {
      const techstacks = await prisma.techStack.findMany({
        orderBy: { name: 'asc' }
      });
      return techstacks;
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
      return { error: 'Failed to fetch tech stacks' };
    }
  })
  
  .get('/:id', async ({ params }) => {
    try {
      const techstack = await prisma.techStack.findUnique({
        where: { id: Number(params.id) }
      });
      
      if (!techstack) {
        return { error: 'Tech stack not found' };
      }
      
      return techstack;
    } catch (error) {
      console.error('Error fetching tech stack:', error);
      return { error: 'Failed to fetch tech stack' };
    }
  })
  
  .use(authMiddleware)
  
  .post('', async ({ body, set }) => {
    try {
      const validatedData = techStackSchema.parse(body);
      const techstack = await prisma.techStack.create({
        data: validatedData
      });
      return techstack;
    } catch (error: any) {
      console.error('Error creating tech stack:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to create tech stack' };
    }
  })
  
  .put('/:id', async ({ params, body, set }) => {
    try {
      const validatedData = techStackSchema.partial().parse(body);
      const techstack = await prisma.techStack.update({
        where: { id: Number(params.id) },
        data: validatedData
      });
      return techstack;
    } catch (error: any) {
      console.error('Error updating tech stack:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to update tech stack' };
    }
  })
  
  .delete('/:id', async ({ params, set }) => {
    try {
      await prisma.techStack.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Tech stack deleted successfully' };
    } catch (error) {
      console.error('Error deleting tech stack:', error);
      set.status = 500;
      return { error: 'Failed to delete tech stack' };
    }
  });
