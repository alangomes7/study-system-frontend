'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useTokenStore from '@/stores/TokenStore';
import { useLogin } from '@/hooks/api/useAuth';

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
      toast.success(`Welcome, ${data.name}!`);
      router.push('/');
    },
    onError: (error: Error) => {
      // Removed console.error to avoid treating handled logic (401) as a crash
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });

  return {
    formData,
    setFormData,
    loginMutation,
    isSubmitting: loginMutation.isPending,
  };
}
