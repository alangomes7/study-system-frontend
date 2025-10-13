import Link from 'next/link';
import { Course } from '@/types/course';

async function getCourses() {
  const response = await fetch('http://localhost:8080/courses', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export default async function CoursesPage() {
  try {
    const courses: Course[] = await getCourses();

    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Courses</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map(course => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className='border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow'
            >
              <h2 className='text-xl font-semibold mb-2'>{course.name}</h2>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                {course.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    return <p className='text-center mt-8 text-red-500'>Error: {message}</p>;
  }
}
