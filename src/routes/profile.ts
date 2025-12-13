import { Elysia } from 'elysia';
import { prisma } from '../config/database';

export const profileRoutes = new Elysia({ prefix: '/api/profile' })
  .get('/', async () => {
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
  
  .post('/', async ({ body }) => {
    try {
      const profile = await prisma.profile.create({
        data: body as any
      });
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return { error: 'Failed to create profile' };
    }
  })
  
  .put('/:id', async ({ params, body }) => {
    try {
      const profile = await prisma.profile.update({
        where: { id: Number(params.id) },
        data: body as any
      });
      return profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'Failed to update profile' };
    }
  })
  
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.profile.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Profile deleted successfully' };
    } catch (error) {
      console.error('Error deleting profile:', error);
      return { error: 'Failed to delete profile' };
    }
  });
