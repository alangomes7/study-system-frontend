import { Course } from '@/types/course';

async function getCourse(id: string) {
  const response = await fetch(`http://localhost:8080/courses/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
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
    const course: Course = await getCourse(id);

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
                <th className='py-2 px-4 border-b'>Professors</th>
              </tr>
            </thead>
            <tbody>
              {course.studyClasses &&
                course.studyClasses.map(studyClass => (
                  <tr key={studyClass.id}>
                    <td className='py-2 px-4 border-b text-center'>
                      {studyClass.code}
                    </td>
                    <td className='py-2 px-4 border-b text-center'>
                      {studyClass.students}
                    </td>
                    <td className='py-2 px-4 border-b text-center'>
                      {studyClass.professors}
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
