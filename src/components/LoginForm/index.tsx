'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useTokenStore from '@/stores/TokenStore';
import { API_BASE_URL } from '@/lib/api/client';

export default function LoginForm() {
  const router = useRouter();
  const setTokenResponse = useTokenStore(s => s.setTokenResponse);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific backend error messages if available
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store the token and user info in Zustand
      setTokenResponse(data);

      toast.success(`Welcome, ${data.name}!`);
      router.push('/');
    } catch (error: unknown) {
      // Changed 'any' to 'unknown' and added a type check
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card p-8 space-y-6 bg-card-background border border-border shadow-sm rounded-lg'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-foreground'>Welcome!</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email and password to login
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='email' className='labelForm'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='name@example.com'
              autoComplete='email'
              required
              className='input-form'
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='password' className='labelForm'>
              Password
            </label>

            <input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              autoComplete='current-password'
              required
              className='input-form'
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <button
            type='submit'
            className='btn btn-primary w-full'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
