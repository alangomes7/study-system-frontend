import { z } from 'zod';

// Base Schema (Shared Fields)
export const baseSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
});
