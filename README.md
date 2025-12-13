# Web Profile Backend

A modern backend API built with Bun, Elysia, and Prisma.

## Tech Stack

- **Runtime**: Bun v1.2.15
- **Framework**: Elysia v1.4.18
- **Database**: PostgreSQL with Prisma v7.1.0
- **ORM Adapter**: @prisma/adapter-pg

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Database connection & Prisma setup
│   │   └── env.ts       # Environment variables
│   ├── middleware/      # Middleware functions
│   │   ├── logger.ts    # Request/response logging
│   │   └── errorHandler.ts  # Error handling
│   ├── routes/          # API routes by resource
│   │   ├── profile.ts   # Profile endpoints
│   │   ├── portfolio.ts # Portfolio endpoints
│   │   ├── blog.ts      # Blog endpoints
│   │   ├── experience.ts # Experience endpoints
│   │   ├── techstack.ts # Tech Stack endpoints
│   │   └── upload.ts    # File upload & serving
│   ├── utils/           # Utility functions
│   └── index.ts         # Main application entry
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Uploaded files storage
└── package.json
```

## Features

- ✅ Modular route structure following Elysia best practices
- ✅ Centralized database configuration with connection pooling
- ✅ Request/response logging middleware
- ✅ Global error handling
- ✅ File upload with Bun's native APIs
- ✅ CORS support
- ✅ Environment-based configuration

## API Endpoints

### Profile
- `GET /api/profile` - Get all profiles
- `GET /api/profile/:id` - Get profile by ID
- `POST /api/profile` - Create profile
- `PUT /api/profile/:id` - Update profile
- `DELETE /api/profile/:id` - Delete profile

### Portfolio
- `GET /api/portfolio` - Get all portfolios (ordered by createdAt desc)
- `GET /api/portfolio/:id` - Get portfolio by ID
- `POST /api/portfolio` - Create portfolio
- `PUT /api/portfolio/:id` - Update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio

### Blog
- `GET /api/blog` - Get all blogs (ordered by createdAt desc)
- `GET /api/blog/:id` - Get blog by ID
- `POST /api/blog` - Create blog
- `PUT /api/blog/:id` - Update blog
- `DELETE /api/blog/:id` - Delete blog

### Experience
- `GET /api/experience` - Get all experiences (ordered by startDate desc)
- `GET /api/experience/:id` - Get experience by ID
- `POST /api/experience` - Create experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Tech Stack
- `GET /api/techstack` - Get all tech stacks (ordered by name asc)
- `GET /api/techstack/:id` - Get tech stack by ID
- `POST /api/techstack` - Create tech stack
- `PUT /api/techstack/:id` - Update tech stack
- `DELETE /api/techstack/:id` - Delete tech stack

### Upload
- `POST /api/upload` - Upload file
- `GET /uploads/:file` - Serve uploaded file

## Development

```bash
# Install dependencies
bun install

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*
```

## Best Practices Implemented

1. **Separation of Concerns**: Routes, config, and middleware are separated
2. **Error Handling**: Centralized error handling middleware
3. **Logging**: Request/response logging for debugging
4. **Type Safety**: TypeScript with strict mode
5. **Code Reusability**: Each route module follows the same pattern
6. **Scalability**: Easy to add new routes/resources
7. **Configuration**: Environment-based configuration
8. **Database**: Connection pooling for better performance
