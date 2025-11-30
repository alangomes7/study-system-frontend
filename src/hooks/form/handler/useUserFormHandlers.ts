'use client';

import { useCallback } from 'react';
import {
  userSchema,
  type userFormData,
  type userFormErrors,
} from '@/lib/schemas';
import { z } from 'zod';
import { type UseMutationResult } from '@tanstack/react-query';
import { UserType } from '@/types';

const unmask = (value: string) => value.replace(/\D/g, '');
type ValidatedUserData = z.infer<typeof userSchema>;

type UseUserFormHandlersProps = {
  formData: userFormData;
  setFormData: React.Dispatch<React.SetStateAction<userFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<userFormErrors>>;
  mutation: UseMutationResult<unknown, Error, any, unknown>; // Relaxed type to any to support different payloads
  userType: UserType; // Added userType
};

export function useUserFormHandlers({
  formData,
  setFormData,
  setErrors,
  mutation,
  userType,
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

      // Conditional Validation: Skip phone/register for User/ADMIN
      const schemaToUse = userSchema;
      if (userType === 'User' || userType === 'ADMIN') {
        // Create a partial schema or relax requirements for UserApp
        // Since we are reusing the schema, we can just validate the fields we care about
        // or use .partial() then .required(...) but userSchema is simple.
        // A simple way is to mock phone/register if they are missing for User/ADMIN to pass Zod
        if (!unmaskedData.phone) unmaskedData.phone = '00000000000'; // Dummy valid
        if (!unmaskedData.register) unmaskedData.register = '00000000000'; // Dummy valid
      }

      const validationResult = schemaToUse.safeParse(unmaskedData);

      if (!validationResult.success) {
        const flattenedErrors = z.flattenError(
          validationResult.error,
        ).fieldErrors;
        setErrors(flattenedErrors);
        return;
      }

      // Prepare payload based on type
      let payload: any = validationResult.data;

      if (userType === 'User' || userType === 'ADMIN') {
        payload = {
          name: validationResult.data.name,
          email: validationResult.data.email,
          role: userType, // Pass the role
          // Password is optional in UserApp type, backend might handle default
        };
      }

      mutation.mutate(payload);
    },
    [formData, setErrors, mutation, userType],
  );

  return {
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}
