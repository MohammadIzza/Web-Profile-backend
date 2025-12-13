import { Elysia } from 'elysia';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { experienceSchema } from '../utils/validation';

export const experienceRoutes = new Elysia({ prefix: '/api/experience' })
  .get('', async () => {
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
  
  .use(authMiddleware)
  
  .post('', async ({ body, set }) => {
    try {
      const validatedData = experienceSchema.parse(body);
      const experience = await prisma.experience.create({
        data: validatedData
      });
      return experience;
    } catch (error: any) {
      console.error('Error creating experience:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to create experience' };
    }
  })
  
  .put('/:id', async ({ params, body, set }) => {
    try {
      const validatedData = experienceSchema.partial().parse(body);
      const experience = await prisma.experience.update({
        where: { id: Number(params.id) },
        data: validatedData
      });
      return experience;
    } catch (error: any) {
      console.error('Error updating experience:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to update experience' };
    }
  })
  
  .delete('/:id', async ({ params, set }) => {
    try {
      await prisma.experience.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Experience deleted successfully' };
    } catch (error) {
      console.error('Error deleting experience:', error);
      set.status = 500;
      return { error: 'Failed to delete experience' };
    }
  });
