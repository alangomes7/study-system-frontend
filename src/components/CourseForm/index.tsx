'use client';

import { useCourseForm } from '@/hooks/useCourseForm';

type CourseFormState = {
  name: string;
  description: string;
};

type CourseFormField = keyof CourseFormState;

interface FieldConfig {
  label: string;
  name: CourseFormField;
  type: 'text' | 'textarea';
}

export default function CreateCourseForm() {
  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
  } = useCourseForm();

  const fields: FieldConfig[] = [
    { label: 'Course Name', name: 'name', type: 'text' },
    { label: 'Course Description', name: 'description', type: 'textarea' },
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
                className='input'
                rows={4}
                disabled={isSubmitting}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className='input'
                disabled={isSubmitting}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
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

        <button
          type='submit'
          className='btn btn-primary disabled:opacity-50'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}
