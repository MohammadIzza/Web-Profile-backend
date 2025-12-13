import { Elysia } from 'elysia';
import { prisma } from '../config/database';

export const experienceRoutes = new Elysia({ prefix: '/api/experience' })
  .get('/', async () => {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: { startDate: 'desc' }
      });
      return experiences;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return { error: 'Failed to fetch experiences' };
    }
  })
  
  .get('/:id', async ({ params }) => {
    try {
      const experience = await prisma.experience.findUnique({
        where: { id: Number(params.id) }
      });
      
      if (!experience) {
        return { error: 'Experience not found' };
      }
      
      return experience;
    } catch (error) {
      console.error('Error fetching experience:', error);
      return { error: 'Failed to fetch experience' };
    }
  })
  
  .post('/', async ({ body }) => {
    try {
      const experience = await prisma.experience.create({
        data: body as any
      });
      return experience;
    } catch (error) {
      console.error('Error creating experience:', error);
      return { error: 'Failed to create experience' };
    }
  })
  
  .put('/:id', async ({ params, body }) => {
    try {
      const experience = await prisma.experience.update({
        where: { id: Number(params.id) },
        data: body as any
      });
      return experience;
    } catch (error) {
      console.error('Error updating experience:', error);
      return { error: 'Failed to update experience' };
    }
  })
  
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.experience.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Experience deleted successfully' };
    } catch (error) {
      console.error('Error deleting experience:', error);
      return { error: 'Failed to delete experience' };
    }
  });
