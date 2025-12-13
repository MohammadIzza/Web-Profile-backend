import { Elysia } from 'elysia';

export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    console.error('Error occurred:', error);

    switch (code) {
      case 'NOT_FOUND':
        set.status = 404;
        return { error: 'Resource not found' };
      
      case 'VALIDATION':
        set.status = 400;
        return { error: 'Validation error', details: error.message };
      
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        return { error: 'Internal server error' };
      
      default:
        set.status = 500;
        return { error: 'An unexpected error occurred' };
    }
  });
