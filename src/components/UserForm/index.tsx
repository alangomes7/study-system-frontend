'use client';

import { IMaskInput } from 'react-imask';
import { useUserForm } from '@/hooks/index';
import { Student, Professor, UserType } from '@/types';
import { DotsAnimation } from '@/components';
import { useRouter } from 'next/navigation';

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  register: string;
};

type UserFormField = keyof UserFormState;

interface UserFormProps {
  userType: UserType;
  title: string;
  user?: Student | Professor | User | null;
  submitLabel?: string;
}

export default function UserForm({
  userType,
  title,
  user = null,
  submitLabel,
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

  // Determine label based on edit mode
  const isEditMode = !!user;
  const inProgressLabel = isEditMode ? 'Updating' : 'Creating';
  const buttonLabel = submitLabel
    ? submitLabel
    : isEditMode
    ? 'Update'
    : 'Create';

  type FieldConfig = {
    label: string;
    name: UserFormField;
    type: string;
    mask?: string;
    inputType?: string;
    autocomplete?: string;
  };

  const fields: FieldConfig[] = [
    { label: 'Name', name: 'name', type: 'text', autocomplete: 'name' },
    {
      label: 'Phone',
      name: 'phone',
      type: 'mask',
      mask: '(00) 0 0000-0000',
      inputType: 'tel',
      autocomplete: 'tel',
    },
    { label: 'Email', name: 'email', type: 'email', autocomplete: 'email' },
    {
      label: 'Register (CPF)',
      name: 'register',
      type: 'mask',
      mask: '000.000.000-00',
      inputType: 'tel',
      autocomplete: 'off',
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>{title}</h1>
      {apiError && <p className='text-red-500 mb-4'>{apiError.message}</p>}

      <form onSubmit={handleSubmit} className='card p-6'>
        {fields.map(field => (
          <div key={field.name} className='mb-4'>
            <label htmlFor={field.name} className='labelForm'>
              {field.label}
            </label>

            {field.type === 'mask' ? (
              <IMaskInput
                type={field.inputType}
                mask={field.mask!}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onAccept={value => handleMaskedChange(field.name, value)}
                className='input-form'
                disabled={isSubmitting}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                autoComplete={field.autocomplete}
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
              <span className='flex items-center gap-2'>
                <DotsAnimation className='w-4 h-4' />
                {`${inProgressLabel}...`}
              </span>
            ) : (
              `${buttonLabel}`
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
