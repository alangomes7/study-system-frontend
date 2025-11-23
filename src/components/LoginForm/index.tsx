'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const router = useRouter();
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
      console.log('Login attempt:', formData);

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password.');
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
            Enter your email and password to sign in
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
            <div className='flex items-center justify-between'>
              <label htmlFor='password' className='labelForm'>
                Password
              </label>

              <Link
                href='/forgot-password'
                className='text-sm text-primary hover:underline'
              >
                Forgot password?
              </Link>
            </div>
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
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
