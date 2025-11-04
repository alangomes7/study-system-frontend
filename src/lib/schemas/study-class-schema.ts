import { z } from 'zod';

// --- Date/Time Constants (based on now) ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentSemester = currentMonth >= 6 ? 2 : 1;

export const studyClassSchema = z
  .object({
    year: z
      .number({ message: 'Year is required' })
      .min(currentYear, `Year must be ${currentYear} or ${currentYear + 1}`)
      .max(
        currentYear + 1,
        `Year must be ${currentYear} or ${currentYear + 1}`,
      ),
    semester: z
      .number({ message: 'Semester is required' })
      .min(1, 'Semester must be 1 or 2')
      .max(2, 'Semester must be 1 or 2'),
    courseId: z.number({
      message: 'Please select a course',
    }),
    professorId: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    // Rule: If selected year is the current year,
    // semester must be >= current semester
    if (data.year === currentYear && data.semester < currentSemester) {
      ctx.addIssue({
        code: 'custom',
        path: ['semester'],
        message: `For ${currentYear}, only semester ${currentSemester} is available`,
      });
    }
  });

export type StudyClassValidatedData = z.infer<typeof studyClassSchema>;

export type StudyClassFormData = Omit<StudyClassValidatedData, 'courseId'> & {
  courseId: number | null;
};

export type StudyClassFormErrors = z.ZodFlattenedError<
  z.infer<typeof studyClassSchema>
>['fieldErrors'];
