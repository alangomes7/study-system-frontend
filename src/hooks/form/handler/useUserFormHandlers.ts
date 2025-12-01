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
import { AnyUserCreationData } from '../types';

type UseUserFormHandlersProps = {
  formData: userFormData;
  setFormData: React.Dispatch<React.SetStateAction<userFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<userFormErrors>>;
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

      const unmaskedData = {
        ...formData,
        phone: unmask(formData.phone),
        register: unmask(formData.register),
        password: formData.password,
      };

      const schemaToUse = userSchema;

      if (userType === 'User' || userType === 'ADMIN') {
        if (!unmaskedData.phone) unmaskedData.phone = '00000000000';
        if (!unmaskedData.register) unmaskedData.register = '00000000000';
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
      let dataPayload: AnyUserCreationData;

      if (userType === 'User' || userType === 'ADMIN') {
        dataPayload = {
          name: validationResult.data.name,
          email: validationResult.data.email,
          role: userType === 'User' ? 'USER' : userType,
          password: validationResult.data.password,
        };
      } else {
        dataPayload = validationResult.data;
      }

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
