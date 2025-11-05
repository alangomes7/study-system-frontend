'use client';

import { IMaskInput } from 'react-imask';
import { useUserForm } from '@/hooks/index';

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  register: string;
};

type UserFormField = keyof UserFormState;

interface UserFormProps {
  userType: 'student' | 'professor';
  title: string;
  submitLabel?: string;
}

export default function UserForm({
  userType,
  title,
  submitLabel = 'Create',
}: UserFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleMaskedChange,
    handleSubmit,
  } = useUserForm(userType);

  type FieldConfig = {
    label: string;
    name: UserFormField;
    type: string;
    mask?: string;
    inputType?: string;
  };

  const fields: FieldConfig[] = [
    { label: 'Name', name: 'name', type: 'text' },
    {
      label: 'Phone',
      name: 'phone',
      type: 'mask',
      mask: '(00) 0 0000-0000',
      inputType: 'tel',
    },
    { label: 'Email', name: 'email', type: 'email' },
    {
      label: 'Register (CPF)',
      name: 'register',
      type: 'mask',
      mask: '000.000.000-00',
      inputType: 'tel',
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
                className='input'
                disabled={isSubmitting}
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
              />
            )}

            {errors[field.name] && (
              <p className='text-red-500 text-sm mt-1'>
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
          {isSubmitting ? `${submitLabel}ing...` : submitLabel}
        </button>
      </form>
    </div>
  );
}
