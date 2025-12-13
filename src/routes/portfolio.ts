import { Elysia } from 'elysia';
import { prisma } from '../config/database';

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
  
  .post('/', async ({ body }) => {
    try {
      const portfolio = await prisma.portfolio.create({
        data: body as any
      });
      return portfolio;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return { error: 'Failed to create portfolio' };
    }
  })
  
  .put('/:id', async ({ params, body }) => {
    try {
      const portfolio = await prisma.portfolio.update({
        where: { id: Number(params.id) },
        data: body as any
      });
      return portfolio;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return { error: 'Failed to update portfolio' };
    }
  })
  
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.portfolio.delete({
        where: { id: Number(params.id) }
      });
      return { message: 'Portfolio deleted successfully' };
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return { error: 'Failed to delete portfolio' };
    }
  });
