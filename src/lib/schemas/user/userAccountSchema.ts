// User Account Schema (User, Admin)
// Includes: Password
import { z } from 'zod';
import { baseSchema } from './baseSchema';

// Excludes: Phone, Register
export const userAccountSchema = baseSchema.extend({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
