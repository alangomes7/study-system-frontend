'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ButtonTheme } from '../ButtonTheme';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <nav className='relative bg-background border-b border-gray-200 dark:border-gray-800'>
      <div className='flex items-center justify-between p-4'>
        {/* Left Section: Theme Button & Brand */}
        <div className='flex items-center space-x-4'>
          <ButtonTheme />
          <Link href='/' className='text-lg font-bold'>
            StudySystem
          </Link>
        </div>

        {/* Middle Section: Desktop Navigation Links (hidden on mobile) */}
        <div className='hidden md:flex items-center space-x-6'>
          <Link href='/courses' className='nav-link'>
            Courses
          </Link>
          <div className='relative'>
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className='nav-link'
            >
              Create
            </button>
            {isCreateOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1'>
                <Link
                  href='/students/create'
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Create Student
                </Link>
                <Link
                  href='/professors/create'
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Create Professor
                </Link>
                <Link
                  href='/courses/create'
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Create Course
                </Link>
                <Link
                  href='/study-classes/create'
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Create Study Class
                </Link>
              </div>
            )}
          </div>
          <Link href='/about' className='nav-link'>
            About
          </Link>
        </div>

        {/* Right Section: Desktop Login Button (hidden on mobile) */}
        <div className='hidden md:block'>
          <Link href='/login' className='btn btn-blue'>
            Login
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) - shown only on mobile */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-foreground focus:outline-none'
          >
            {/* ... (SVG icons) */}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className='px-4 pt-2 pb-4 space-y-2 md:hidden bg-background'>
          <Link href='/courses' className='block px-2 py-1 rounded nav-link'>
            Courses
          </Link>
          {/* ... (rest of the mobile menu) */}
        </div>
      )}
    </nav>
  );
}
