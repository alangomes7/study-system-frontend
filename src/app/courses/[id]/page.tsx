import { Course } from '@/types/course';
import { StudyClass } from '@/types/study-class';
import { Subscription } from '@/types/subscription';

import Link from 'next/link';

async function getCourse(id: string): Promise<Course> {
  const response = await fetch(`http://localhost:8080/courses/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }
  return response.json();
}

async function getStudyClasses(courseId: string): Promise<StudyClass[]> {
  const response = await fetch(
    `http://localhost:8080/study-classes/course/${courseId}`,
    {
      cache: 'no-store',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch study classes');
  }
  return response.json();
}

async function getSubscriptions(studyClassId: number): Promise<Subscription[]> {
  const response = await fetch(
    `http://localhost:8080/subscriptions?studyClassId=${studyClassId}`,
    {
      cache: 'no-store',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }
  return response.json();
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const course = await getCourse(id);
    const studyClasses = await getStudyClasses(id);

    const studyClassesWithStudentCount = await Promise.all(
      studyClasses.map(async studyClass => {
        const subscriptions = await getSubscriptions(studyClass.id);
        return {
          ...studyClass,
          studentCount: subscriptions.length,
        };
      }),
    );

    if (!course) {
      return <p className='text-center mt-8'>Course not found.</p>;
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-2'>{course.name}</h1>
        <p className='text-lg text-gray-600 dark:text-gray-400 mb-6'>
          {course.description}
        </p>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b'>Study Class</th>
                <th className='py-2 px-4 border-b'>Students</th>
                <th className='py-2 px-4 border-b'>Professor</th>
              </tr>
            </thead>
            <tbody>
              {studyClassesWithStudentCount.map(studyClass => (
                <tr
                  key={studyClass.id}
                  className='hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <td className='py-2 px-4 border-b text-center'>
                    <Link
                      href={`/study-classes/${studyClass.id}`}
                      className='block w-full h-full'
                    >
                      {studyClass.classCode}
                    </Link>
                  </td>
                  <td className='py-2 px-4 border-b text-center'>
                    <Link
                      href={`/study-classes/${studyClass.id}`}
                      className='block w-full h-full'
                    >
                      {studyClass.studentCount}
                    </Link>
                  </td>
                  <td className='py-2 px-4 border-b text-center'>
                    <Link
                      href={`/study-classes/${studyClass.id}`}
                      className='block w-full h-full'
                    >
                      {studyClass.professorName || 'Not Assigned'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
