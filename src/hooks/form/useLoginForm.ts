'use client';

import { useLoginFormData } from './data/useLoginFormData';
import { useLoginFormHandlers } from './handler/useLoginFormHandlers';

export default function useLoginForm() {
  const { formData, setFormData, loginMutation, isSubmitting } =
    useLoginFormData();

  const { handleChange, handleSubmit } = useLoginFormHandlers({
    formData,
    setFormData,
    loginMutation,
  });

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
}
