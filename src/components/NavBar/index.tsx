'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ButtonTheme } from '../ButtonTheme';
import { MenuIcon, XIcon } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // --- mounted state ---
  const [mounted, setMounted] = useState(false);
  // Default to false (desktop) to match server render
  const [isMobile, setIsMobile] = useState(false);

  const createMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // --- Set mounted and THEN check mobile ---
  useEffect(() => {
    setMounted(true); // Signal client mount

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside (for menus)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setIsCreateOpen(false);
      }
      if (
        manageMenuRef.current &&
        !manageMenuRef.current.contains(event.target as Node)
      ) {
        setIsManageOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Only add listener if mounted
    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mounted]);

  const navLinkClass =
    'text-sm font-medium text-foreground/80 hover:text-foreground transition-colors';
  const menuItemClass =
    'block px-4 py-2 text-sm text-foreground hover:bg-foreground/10 rounded-md';

  return (
    <nav
      ref={navRef}
      className='relative bg-background border-b border-border z-50'
    >
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
          <Link href='/students' className={navLinkClass}>
            Students
          </Link>
          <Link href='/study-classes' className={navLinkClass}>
            Study Classes
          </Link>

          {/* Create Dropdown (Desktop) */}
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
              <div className='absolute right-0 w-48 bg-card-background border border-border rounded-md shadow-lg py-1 p-1 z-50'>
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

          {/* Manage Dropdown (Desktop) */}
          <div
            ref={manageMenuRef}
            className='relative'
            onMouseEnter={() => !isMobile && setIsManageOpen(true)}
            onMouseLeave={() => !isMobile && setIsManageOpen(false)}
          >
            <button
              onClick={() => isMobile && setIsManageOpen(!isManageOpen)}
              className={navLinkClass}
            >
              Manage
            </button>

            {isManageOpen && (
              <div className='absolute right-0 w-48 bg-card-background border border-border rounded-md shadow-lg py-1 p-1 z-50'>
                <Link href='/students/enroll' className={menuItemClass}>
                  Enroll Student
                </Link>
                <Link
                  href='/study-classes/student-group'
                  className={menuItemClass}
                >
                  Student Groups
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
          {!mounted ? (
            <div className='h-6 w-6' />
          ) : (
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
          )}
        </div>
      </div>

      {/* --- Mobile Overlay + Menu Together --- */}
      {mounted && isOpen && (
        <div className='fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex justify-end'>
          {/* Clicking the overlay area closes the menu */}
          <div
            className='flex-1'
            onClick={() => {
              setIsOpen(false);
              setIsCreateOpen(false);
              setIsManageOpen(false);
            }}
          />

          {/* Slide-in Mobile Menu */}
          <div className='w-3/4 sm:w-2/5 h-full bg-background border-l border-border shadow-xl p-4 space-y-2 overflow-y-auto animate-slide-in'>
            {/* --- Main Links --- */}
            <Link
              href='/courses'
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            <Link
              href='/students'
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              Students
            </Link>
            <Link
              href='/study-classes'
              className={menuItemClass}
              onClick={() => setIsOpen(false)}
            >
              Study Classes
            </Link>

            {/* --- Create Section (Click to toggle) --- */}
            <div ref={createMenuRef} className='border-t border-border pt-2'>
              <button
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className='w-full text-left font-semibold text-foreground/70 mb-1 px-4 py-2'
              >
                Create
              </button>

              {isCreateOpen && (
                <div className='pl-2 space-y-1'>
                  <Link
                    href='/students/create'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Create Student
                  </Link>
                  <Link
                    href='/professors/create'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Create Professor
                  </Link>
                  <Link
                    href='/courses/create'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Create Course
                  </Link>
                  <Link
                    href='/study-classes/create'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Create Study Class
                  </Link>
                </div>
              )}
            </div>

            {/* --- Manage Section (Click to toggle) --- */}
            <div ref={manageMenuRef} className='border-t border-border pt-2'>
              <button
                onClick={() => setIsManageOpen(!isManageOpen)}
                className='w-full text-left font-semibold text-foreground/70 mb-1 px-4 py-2'
              >
                Manage
              </button>

              {isManageOpen && (
                <div className='pl-2 space-y-1'>
                  <Link
                    href='/students/enroll'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Enroll Student
                  </Link>
                  <Link
                    href='/study-classes/student-group'
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Student Groups
                  </Link>
                </div>
              )}
            </div>

            {/* --- Other Links --- */}
            <Link
              href='/about'
              className={`${menuItemClass} border-t border-border`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <div className='border-t border-border pt-2'>
              <Link
                href='/login'
                className='btn btn-primary w-full'
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
