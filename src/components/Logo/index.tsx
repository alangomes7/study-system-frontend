import { ButtonTheme } from '../ButtonTheme';

export function Logo() {
  <svg
    className='h-8 w-8 text-indigo-500 dark:text-indigo-400'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
    <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
  </svg>;

  return (
    <header className='bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-4 px-6 shadow-md flex items-center justify-between transition-colors duration-300'>
      <div className='flex items-center gap-4'>
        <Logo />
        <strong className='text-xl font-bold hidden sm:block'>
          Study System
        </strong>
      </div>
      <ButtonTheme />
    </header>
  );
}
