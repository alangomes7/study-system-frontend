import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Invalid phone number' })
    .max(11, { message: 'Invalid phone number' }),
  register: z.string().length(11, { message: 'Invalid CPF' }),
});

export type userFormData = z.infer<typeof userSchema>;

export type userFormErrors = z.ZodFlattenedError<
  z.infer<typeof userSchema>
>['fieldErrors'];
