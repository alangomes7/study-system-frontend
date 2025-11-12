'use client';

import { useCallback } from 'react';
import {
  userSchema,
  type userFormData,
  type userFormErrors,
} from '@/lib/schemas';
import { z } from 'zod';
import { type UseMutationResult } from '@tanstack/react-query'; // Assuming

const unmask = (value: string) => value.replace(/\D/g, '');

type UseUserFormHandlersProps = {
  formData: userFormData;
  setFormData: React.Dispatch<React.SetStateAction<userFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<userFormErrors>>;
  mutation: UseMutationResult<unknown, Error, unknown, unknown>;
};

/**
 * Provides memoized event handlers for the user form.
 */
export function useUserFormHandlers({
  formData,
  setFormData,
  setErrors,
  mutation,
}: UseUserFormHandlersProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    [setFormData],
  );

  const handleMaskedChange = useCallback(
    (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    [setFormData],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const unmaskedData = {
        ...formData,
        phone: unmask(formData.phone),
        register: unmask(formData.register),
      };

      const validationResult = userSchema.safeParse(unmaskedData);

      if (!validationResult.success) {
        const flattenedErrors = z.flattenError(
          validationResult.error,
        ).fieldErrors;
        setErrors(flattenedErrors);
        return;
      }

      // Call the selected mutation
      mutation.mutate(validationResult.data);
    },
    [formData, setErrors, mutation],
  );

  return {
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}
