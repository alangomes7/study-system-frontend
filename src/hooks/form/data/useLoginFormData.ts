'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/TokenStore';
import { useLogin } from '@/hooks/api/useAuth';
import { DialogPopup } from '@/components';

export function useLoginFormData() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const setTokenResponse = useTokenStore(s => s.setTokenResponse);

  const loginMutation = useLogin({
    onSuccess: data => {
      setTokenResponse(data);
      DialogPopup.success(`Welcome, ${data.name}!`);
      router.push('/');
    },
    onError: (error: Error) => {
      // Removed console.error to avoid treating handled logic (401) as a crash
      DialogPopup.error(error.message || 'Login failed. Please try again.');
    },
  });

  return {
    formData,
    setFormData,
    loginMutation,
    isSubmitting: loginMutation.isPending,
  };
}
