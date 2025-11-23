'use client';

import { useCourseForm } from '@/hooks';
import { useRouter } from 'next/navigation';
import { DotsAnimation } from '@/components';

type CourseFormState = {
  name: string;
  description: string;
};

type CourseFormField = keyof CourseFormState;

interface FieldConfig {
  label: string;
  name: CourseFormField;
  type: 'text' | 'textarea';
  autocomplete?: string;
}

export default function CreateCourseForm() {
  const router = useRouter();
  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
  } = useCourseForm();

  const fields: FieldConfig[] = [
    { label: 'Course Name', name: 'name', type: 'text', autocomplete: 'off' },
    {
      label: 'Course Description',
      name: 'description',
      type: 'textarea',
      autocomplete: 'off',
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Create New Course
      </h1>

      {apiError && (
        <p className='text-red-500 mb-4'>
          Error creating course: {apiError.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className='card p-6'>
        {fields.map(field => (
          <div key={field.name} className='mb-4'>
            <label htmlFor={field.name} className='labelForm'>
              {field.label}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className='input-form'
                rows={4}
                disabled={isSubmitting}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                autoComplete={field.autocomplete} // <-- 3. ADDED
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className='input-form'
                disabled={isSubmitting}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                autoComplete={field.autocomplete}
              />
            )}

            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className='text-red-500 text-sm mt-1'
              >
                {errors[field.name]?.[0]}
              </p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className='flex items-center gap-4 pt-2'>
          {/* --- SUBMIT BUTTON --- */}
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                {/* 2. LAYOUT SUGGESTION */}
                <DotsAnimation className='w-4 h-4 mr-2' />
                Creating...
              </>
            ) : (
              'Create Course'
            )}
          </button>

          {/* --- CANCEL BUTTON --- */}
          <button
            type='button'
            onClick={() => router.back()}
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
