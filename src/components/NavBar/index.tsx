'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ButtonTheme } from '../ButtonTheme';
import { MenuIcon, XIcon } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // A consistent style for nav links that uses theme variables
  const navLinkClass =
    'text-sm font-medium text-foreground/80 hover:text-foreground transition-colors';

  // A consistent style for dropdown/menu items
  const menuItemClass =
    'block px-4 py-2 text-sm text-foreground hover:bg-foreground/10 rounded-md';

  return (
    <nav className='relative bg-background border-b border-border'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center space-x-4'>
          <ButtonTheme />
          <Link href='/' className='text-lg font-bold text-foreground'>
            StudySystem
          </Link>
        </div>

        {/* Middle Section: Desktop Navigation Links (hidden on mobile) */}
        <div className='hidden md:flex items-center space-x-6'>
          <Link href='/courses' className={navLinkClass}>
            Courses
          </Link>
          <div className='relative'>
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className={navLinkClass}
            >
              Create
            </button>
            {isCreateOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-card-background border border-border rounded-md shadow-lg py-1 p-1'>
                <Link href='/students/create' className={menuItemClass}>
                  Create Student
                </Link>
                <Link href='/professors/create' className={menuItemClass}>
                  Create Professor
                </Link>
                <Link href='/courses/create' className={menuItemClass}>
                  Create Course
                </Link>
                <Link href='/study-classes/create' className={menuItemClass}>
                  Create Study Class
                </Link>
              </div>
            )}
          </div>
          <Link href='/about' className={navLinkClass}>
            About
          </Link>
        </div>

        {/* Right Section: Desktop Login Button (hidden on mobile) */}
        <div className='hidden md:block'>
          <Link href='/login' className='btn btn-primary'>
            Login
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) - shown only on mobile */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-foreground focus:outline-none'
          >
            {isOpen ? (
              <XIcon className='h-6 w-6' />
            ) : (
              <MenuIcon className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className='px-4 pt-2 pb-4 space-y-2 md:hidden bg-background'>
          <Link
            href='/courses'
            className='block px-2 py-1 rounded text-foreground/80 hover:text-foreground'
          >
            Courses
          </Link>
        </div>
      )}
    </nav>
  );
}
