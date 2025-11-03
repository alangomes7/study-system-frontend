'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ButtonTheme } from '../ButtonTheme';
import { MenuIcon, XIcon } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const createMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Detect if user is on mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setIsCreateOpen(false);
      }

      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass =
    'text-sm font-medium text-foreground/80 hover:text-foreground transition-colors';
  const menuItemClass =
    'block px-4 py-2 text-sm text-foreground hover:bg-foreground/10 rounded-md';

  return (
    <nav ref={navRef} className='relative bg-background border-b border-border'>
      <div className='flex items-center justify-between p-4'>
        {/* Left section */}
        <div className='flex items-center space-x-4'>
          <ButtonTheme />
          <Link href='/' className='text-lg font-bold text-foreground'>
            StudySystem
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-6'>
          <Link href='/courses' className={navLinkClass}>
            Courses
          </Link>

          {/* Hover-based Dropdown (Desktop) */}
          <div
            ref={createMenuRef}
            className='relative'
            onMouseEnter={() => !isMobile && setIsCreateOpen(true)}
            onMouseLeave={() => !isMobile && setIsCreateOpen(false)}
          >
            <button
              onClick={() => isMobile && setIsCreateOpen(!isCreateOpen)}
              className={navLinkClass}
            >
              Create
            </button>

            {isCreateOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-card-background border border-border rounded-md shadow-lg py-1 p-1 z-50'>
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

        {/* Desktop Login */}
        <div className='hidden md:block'>
          <Link href='/login' className='btn btn-primary'>
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className='px-4 pt-2 pb-4 space-y-2 md:hidden bg-background border-t border-border'>
          <Link href='/courses' className={menuItemClass}>
            Courses
          </Link>

          {/* "Create" Section (Mobile - Requires Click) */}
          <div ref={createMenuRef} className='border-t border-border pt-2'>
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className='w-full text-left font-semibold text-foreground/70 mb-1'
            >
              Create
            </button>

            {isCreateOpen && (
              <div className='pl-2 space-y-1'>
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

          <Link href='/about' className={menuItemClass}>
            About
          </Link>

          <div className='border-t border-border pt-2'>
            <Link href='/login' className='btn btn-primary w-full'>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
