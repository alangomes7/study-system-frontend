'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ButtonTheme } from '../ButtonTheme';

export default function NavBar() {
  // State to manage whether the mobile menu is open or not
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
          <Link href='/courses' className='text-foreground hover:text-gray-500'>
            Courses
          </Link>
          <div className='relative'>
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className='text-foreground hover:text-gray-500'
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
          <Link href='/about' className='text-foreground hover:text-gray-500'>
            About
          </Link>
        </div>

        {/* Right Section: Desktop Login Button (hidden on mobile) */}
        <div className='hidden md:block'>
          <Link
            href='/login'
            className='px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600'
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) - shown only on mobile */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-foreground focus:outline-none'
          >
            {/* Conditional rendering for Hamburger or Close icon */}
            {isOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16m-7 6h7'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - shown only on mobile when isOpen is true */}
      {isOpen && (
        <div className='px-4 pt-2 pb-4 space-y-2 md:hidden bg-background'>
          <Link
            href='/courses'
            className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
          >
            Courses
          </Link>
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className='block w-full text-left px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
          >
            Create
          </button>
          {isCreateOpen && (
            <div className='pl-4'>
              <Link
                href='/students/create'
                className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
              >
                Create Student
              </Link>
              <Link
                href='/professors/create'
                className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
              >
                Create Professor
              </Link>
              <Link
                href='/courses/create'
                className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
              >
                Create Course
              </Link>
              <Link
                href='/study-classes/create'
                className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
              >
                Create Study Class
              </Link>
            </div>
          )}
          <Link
            href='/about'
            className='block px-2 py-1 rounded text-foreground hover:bg-gray-200 dark:hover:bg-gray-800'
          >
            About
          </Link>
          <Link
            href='/login'
            className='block w-full px-4 py-2 mt-2 font-semibold text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600'
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
