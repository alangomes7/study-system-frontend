'use client';

import { useLoginForm } from '@/hooks';
import { DotsAnimation } from '@/components';

export default function LoginForm() {
  const { formData, handleChange, handleSubmit, isSubmitting } = useLoginForm();

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
            {isSubmitting ? (
              <span className='flex items-center justify-center gap-2'>
                <DotsAnimation className='w-4 h-4' />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
