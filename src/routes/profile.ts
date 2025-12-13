import { Elysia } from 'elysia';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { profileSchema } from '../utils/validation';

export const profileRoutes = new Elysia({ prefix: '/api/profile' })
  .get('', async () => {
    try {
      const profiles = await prisma.profile.findMany();
      return profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { error: 'Failed to fetch profiles' };
    }
  })
  
  .get('/:id', async ({ params }) => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: Number(params.id) }
      });
      
      if (!profile) {
        return { error: 'Profile not found' };
      }
      
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { error: 'Failed to fetch profile' };
    }
  })
  
  .use(authMiddleware)
  
  .post('', async ({ body, set }) => {
    try {
      // Validate input
      const validatedData = profileSchema.parse(body);
      
      const profile = await prisma.profile.create({
        data: validatedData
      });
      return profile;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      set.status = 400;
      
      if (error.errors) {
        return { 
          error: 'Validation failed', 
          details: error.errors.map((e: any) => e.message)
        };
      }
      
      return { error: 'Failed to create profile' };
    }
  })
  
  .put('/:id', async ({ params, body, set }) => {
    try {
      // Validate input
      const validatedData = profileSchema.partial().parse(body);
      
      const profile = await prisma.profile.update({
        where: { id: Number(params.id) },
        data: validatedData
      });
      return profile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      set.status = 400;
      
      if (error.errors) {
        return { 
          error: 'Validation failed', 
          details: error.errors.map((e: any) => e.message)
        };
      }
      
      return { error: 'Failed to update profile' };
    }
  })
  
  .delete('/:id', async ({ params, set }) => {
    try {
      await prisma.profile.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Profile deleted successfully' };
    } catch (error) {
      console.error('Error deleting profile:', error);
      set.status = 500;
      return { error: 'Failed to delete profile' };
    }
  });
