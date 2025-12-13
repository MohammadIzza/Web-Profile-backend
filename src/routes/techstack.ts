import { Elysia } from 'elysia';
import { prisma } from '../config/database';

export const techstackRoutes = new Elysia({ prefix: '/api/techstack' })
  .get('/', async () => {
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
  
  .post('/', async ({ body }) => {
    try {
      const techstack = await prisma.techStack.create({
        data: body as any
      });
      return techstack;
    } catch (error) {
      console.error('Error creating tech stack:', error);
      return { error: 'Failed to create tech stack' };
    }
  })
  
  .put('/:id', async ({ params, body }) => {
    try {
      const techstack = await prisma.techStack.update({
        where: { id: Number(params.id) },
        data: body as any
      });
      return techstack;
    } catch (error) {
      console.error('Error updating tech stack:', error);
      return { error: 'Failed to update tech stack' };
    }
  })
  
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.techStack.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Tech stack deleted successfully' };
    } catch (error) {
      console.error('Error deleting tech stack:', error);
      return { error: 'Failed to delete tech stack' };
    }
  });
