import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-lg font-bold">
          StudySystem
        </Link>
        <Link href="/courses" className="text-foreground hover:text-gray-500">
          Courses
        </Link>
        <Link href="/about" className="text-foreground hover:text-gray-500">
          About
        </Link>
      </div>
      <div>
        <Link href="/login" className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
          Login
        </Link>
      </div>
    </nav>
  );
}