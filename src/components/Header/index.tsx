import { ButtonTheme } from '../ButtonTheme';
import { Logo } from '../Logo';

export function Header() {
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
