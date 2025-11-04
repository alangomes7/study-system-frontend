import { z } from 'zod';

export const courseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export type CourseFormErrors = z.ZodFlattenedError<
  z.infer<typeof courseSchema>
>['fieldErrors'];
