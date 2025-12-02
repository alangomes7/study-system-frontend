'use client';

import { useRouter } from 'next/navigation';
import useUserForm from '@/hooks/form/useUserForm';
import { FormAlerts } from './components/FormAlerts';
import { FormInput } from './components/FormInput';
import { FormActions } from './components/FormActions';
import { UserFormProps } from './types';
import { ALL_FIELDS } from './constants';

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
  const hasValidationErrors = Object.keys(errors).length > 0;

  const isInternalUser = userType === 'ADMIN' || userType === 'User';

  const activeFields = ALL_FIELDS.filter(field => {
    if (isInternalUser) {
      // ADMIN and User:
      // - Show: Name, Email, Password
      // - Hide: Phone, Register (CPF)
      return field.name !== 'phone' && field.name !== 'register';
    } else {
      // Student, Professor (and any others):
      // - Show: Name, Email, Phone, Register (CPF)
      // - Hide: Password
      return field.name !== 'password';
    }
  });

  return (
    <div className='container mx-auto py-2 max-w-2xl'>
      {title && (
        <h1 className='text-3xl font-bold mb-6 text-foreground'>{title}</h1>
      )}

      <FormAlerts apiError={apiError} errors={errors} />

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className='card bg-card-background border border-border shadow-sm rounded-lg'
      >
        {activeFields.map(field => (
          <FormInput
            key={field.name}
            field={field}
            value={(formData as any)[field.name]}
            error={(errors as any)[field.name]}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onMaskChange={handleMaskedChange}
          />
        ))}

        <FormActions
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
          disableSubmit={disableSubmit}
          buttonLabel={buttonLabel}
          inProgressLabel={inProgressLabel}
          hasErrors={hasValidationErrors}
        />
      </form>
    </div>
  );
}
