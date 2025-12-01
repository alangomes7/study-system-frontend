'use client';

import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';
import { useUserForm } from '@/hooks/index';
import { Student, Professor, UserType, UserApp } from '@/types';
import { DotsAnimation } from '@/components';

// --- Types ---

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  register: string;
  password: string;
};

type UserFormField = keyof UserFormState;

interface UserFormProps {
  userType: UserType;
  title?: string;
  user?: Student | Professor | UserApp | null;
  submitLabel?: string;
  disableSubmit?: boolean;
}

type FieldConfig = {
  label: string;
  name: UserFormField;
  type: 'text' | 'email' | 'password' | 'mask';
  mask?: string;
  inputType?: string;
  autoComplete?: string;
};

// --- Configuration (Moved outside component for performance) ---

const allFields: FieldConfig[] = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
  },
  {
    label: 'Phone',
    name: 'phone',
    type: 'mask',
    mask: '(00) 0 0000-0000',
    inputType: 'tel',
    autoComplete: 'tel',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    label: 'Register (CPF)',
    name: 'register',
    type: 'mask',
    mask: '000.000.000-00',
    inputType: 'tel',
    autoComplete: 'off',
  },
];

export default function UserForm({
  userType,
  title,
  user = null,
  submitLabel,
  disableSubmit = false,
}: UserFormProps) {
  const router = useRouter();

  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleMaskedChange,
    handleSubmit,
  } = useUserForm({ userType, user });

  const isEditMode = !!user;
  const inProgressLabel = isEditMode ? 'Updating' : 'Creating';
  const buttonLabel = submitLabel ?? (isEditMode ? 'Update' : 'Create');

  // Filter fields based on userType
  const fields = allFields.filter(field => {
    switch (userType) {
      case 'ADMIN':
      case 'User':
        // Users and ADMIN do NOT see phone/register, but DO see password
        return field.name !== 'phone' && field.name !== 'register';

      case 'Student':
      case 'Professor':
        // Students and Professors do NOT see password
        return field.name !== 'password';

      default:
        return true;
    }
  });

  return (
    <div className='container mx-auto py-2 max-w-2xl'>
      {title && (
        <h1 className='text-3xl font-bold mb-6 text-foreground'>{title}</h1>
      )}

      {apiError && <p className='text-red-500 mb-4'>{apiError.message}</p>}

      <form
        onSubmit={handleSubmit}
        className='card bg-card-background border border-border shadow-sm rounded-lg'
      >
        {fields.map(field => (
          <div key={field.name} className='mb-4'>
            <label htmlFor={field.name} className='labelForm'>
              {field.label}
            </label>

            {field.type === 'mask' ? (
              <IMaskInput
                id={field.name}
                name={field.name}
                mask={field.mask!}
                type={field.inputType}
                // Handle null/undefined values to prevent "uncontrolled" warnings
                value={formData[field.name] ?? ''}
                onAccept={(value: string) =>
                  handleMaskedChange(field.name, value)
                }
                className='input-form'
                disabled={isSubmitting}
                autoComplete={field.autoComplete}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                // Handle null/undefined values to prevent "uncontrolled" warnings
                value={formData[field.name] ?? ''}
                onChange={handleChange}
                className='input-form'
                disabled={isSubmitting}
                autoComplete={field.autoComplete}
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

        {/* Buttons */}
        <div className='flex items-center gap-4 pt-2'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting || disableSubmit}
          >
            {isSubmitting ? (
              <span className='flex items-center gap-2'>
                <DotsAnimation className='w-4 h-4' />
                {`${inProgressLabel}...`}
              </span>
            ) : (
              buttonLabel
            )}
          </button>

          <button
            type='button'
            onClick={() => router.back()}
            className='btn border border-border hover:bg-foreground/5'
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
