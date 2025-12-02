'use client';

import { useCallback } from 'react';
import {
  userAccountSchema,
  userEntitySchema,
  type UserFormData,
  type UserFormErrors,
} from '@/lib/schemas';
import { z } from 'zod';
import { type UseMutationResult } from '@tanstack/react-query';
import { UserType } from '@/types';
import { AnyUserCreationData } from '../types';

type UseUserFormHandlersProps = {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<UserFormErrors>>;
  // We accept a generic mutation result.
  mutation: UseMutationResult<unknown, Error, any, unknown>;
  userType: UserType;
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

      // 1. Determine User Category & Active Schema
      const isInternalUser = userType === 'User' || userType === 'ADMIN';
      const activeSchema = isInternalUser
        ? userAccountSchema
        : userEntitySchema;

      // 2. Prepare Data for Validation
      // We cast to 'any' to safely access properties that might not exist on the Union type
      // (e.g., 'phone' doesn't exist on UserAccountData)
      const rawData = formData as any;

      const dataToValidate = {
        ...rawData,
        // Unmask Phone/CPF if they exist
        phone: rawData.phone ? unmask(rawData.phone) : undefined,
        register: rawData.register ? unmask(rawData.register) : undefined,
      };

      // 3. Validate against the specific schema
      const validationResult = activeSchema.safeParse(dataToValidate);

      if (!validationResult.success) {
        const flattenedErrors = validationResult.error.flatten().fieldErrors;
        setErrors(flattenedErrors);
        return;
      }

      const validData = validationResult.data;

      // 4. Prepare Payload
      let dataPayload: AnyUserCreationData;

      if (isInternalUser) {
        // Handle Admin/User Payload
        // We strictly pull fields validated by userAccountSchema
        const accountData = validData as z.infer<typeof userAccountSchema>;
        dataPayload = {
          name: accountData.name,
          email: accountData.email,
          password: accountData.password,
          role: userType === 'User' ? 'USER' : 'ADMIN',
        };
      } else {
        // Handle Student/Professor Payload
        // We pass the data as is (UserEntityData)
        dataPayload = validData as AnyUserCreationData;
      }

      // Submit
      mutation.mutate(dataPayload);
    },
    [formData, setErrors, mutation, userType],
  );

  return {
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}

const unmask = (value: string) => value.replace(/\D/g, '');
