import React from 'react';
import { IMaskInput } from 'react-imask';
import { FieldConfig } from '../types';

interface FormInputProps {
  field: FieldConfig;
  value: any;
  error?: string | string[];
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  onMaskChange: (name: string, value: string) => void;
}

export const FormInput = ({
  field,
  value,
  error,
  isSubmitting,
  onChange,
  onMaskChange,
}: FormInputProps) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const inputValue = value ?? '';

  return (
    <div className='mb-4'>
      <label htmlFor={field.name} className='labelForm'>
        {field.label}
      </label>

      {field.type === 'mask' ? (
        <IMaskInput
          id={field.name}
          name={field.name}
          mask={field.mask!}
          type={field.inputType}
          value={inputValue}
          onAccept={(val: string) => onMaskChange(field.name, val)}
          className='input-form'
          disabled={isSubmitting}
          autoComplete={field.autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={inputValue}
          onChange={onChange}
          className='input-form'
          disabled={isSubmitting}
          autoComplete={field.autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
      )}

      {errorMessage && (
        <p id={`${field.name}-error`} className='text-red-500 text-sm mt-1'>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
