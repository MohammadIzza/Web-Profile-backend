import { Elysia } from 'elysia';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { portfolioSchema } from '../utils/validation';

export const portfolioRoutes = new Elysia({ prefix: '/api/portfolio' })
  .get('/', async () => {
    try {
      const portfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return portfolios;
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return { error: 'Failed to fetch portfolios' };
    }
  })
  
  .get('/:id', async ({ params }) => {
    try {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: Number(params.id) }
      });
      
      if (!portfolio) {
        return { error: 'Portfolio not found' };
      }
      
      return portfolio;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return { error: 'Failed to fetch portfolio' };
    }
  })
  
  .use(authMiddleware)
  
  .post('/', async ({ body, set }) => {
    try {
      const validatedData = portfolioSchema.parse(body);
      const portfolio = await prisma.portfolio.create({
        data: validatedData
      });
      return portfolio;
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to create portfolio' };
    }
  })
  
  .put('/:id', async ({ params, body, set }) => {
    try {
      const validatedData = portfolioSchema.partial().parse(body);
      const portfolio = await prisma.portfolio.update({
        where: { id: Number(params.id) },
        data: validatedData
      });
      return portfolio;
    } catch (error: any) {
      console.error('Error updating portfolio:', error);
      set.status = 400;
      if (error.errors) {
        return { error: 'Validation failed', details: error.errors.map((e: any) => e.message) };
      }
      return { error: 'Failed to update portfolio' };
    }
  })
  
  .delete('/:id', async ({ params, set }) => {
    try {
      await prisma.portfolio.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Portfolio deleted successfully' };
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      set.status = 500;
      return { error: 'Failed to delete portfolio' };
    }
  });
