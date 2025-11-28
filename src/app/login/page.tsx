import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Access your account',
};

export default function LoginPage() {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-80px)]',
        'p-4 animate-fade-in',
      )}
    >
      <LoginForm />

      {/* New Sign Up Section */}
      <div className={clsx('text-center text-sm text-gray-600')}>
        <p>
          Don't have an account?{' '}
          <Link
            href='/manage/create/user'
            className={clsx(
              'font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors',
            )}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
