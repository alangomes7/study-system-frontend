export const NAV_LINKS = {
  main: [
    { href: '/courses', label: 'Courses' },
    { href: '/professors', label: 'Professors' },
    { href: '/students', label: 'Students' },
    { href: '/study-classes', label: 'Study Classes' },
  ],
  create: [
    { href: '/manage/create/student', label: 'Create Student' },
    { href: '/manage/create/professor', label: 'Create Professor' },
    { href: '/manage/create/course', label: 'Create Course' },
    { href: '/manage/create/study-class', label: 'Create Study Class' },
    {
      href: '/manage/create/study-class/student-group',
      label: 'Student Groups',
    },
  ],
  enroll: [
    { href: '/manage/subscribe/students', label: 'Enroll Student' },
    { href: '/manage/subscribe/professor', label: 'Enroll Professor' },
  ],
};

export const STYLES = {
  navLink:
    'text-sm font-medium text-foreground/80 hover:text-foreground transition-all px-3 py-2 rounded-md hover:bg-foreground/5',
  activeNavLink:
    'text-sm font-medium text-primary font-semibold transition-all bg-primary/10 px-3 py-2 rounded-md',
  menuItem:
    'block px-4 py-2 text-sm text-foreground hover:bg-foreground/10 rounded-md',
  activeMenuItem:
    'block px-4 py-2 text-sm text-primary bg-primary/10 rounded-md',
};
