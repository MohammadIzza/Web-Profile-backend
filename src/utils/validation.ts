import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email('Invalid email address'),
});

// Profile Schemas
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
});

// Portfolio Schemas
export const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  github: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// Blog Schemas
export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

// Experience Schemas
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  description: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
});

// Tech Stack Schemas
export const techStackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional(),
  icon: z.string().optional(),
  proficiency: z.number().min(0).max(100).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type TechStackInput = z.infer<typeof techStackSchema>;
