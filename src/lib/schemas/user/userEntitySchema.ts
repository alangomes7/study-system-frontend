// User Entity Schema (Student, Professor)
// Includes: Phone, Register (CPF)

import { z } from 'zod';
import { baseSchema } from './baseSchema';

// Helper to strip special characters (keep only digits)
const removeSpecialChars = (val: string) => val.replace(/\D/g, '');

// Excludes: Password
export const userEntitySchema = baseSchema.extend({
  phone: z
    .string()
    .transform(removeSpecialChars) // 1. Strip special chars first
    .pipe(z.string().length(11, { message: 'Invalid phone number' })), // 2. Validate clean length

  register: z
    .string()
    .transform(removeSpecialChars) // 1. Strip special chars first
    .pipe(z.string().length(11, { message: 'Invalid CPF' })), // 2. Validate clean length
});
