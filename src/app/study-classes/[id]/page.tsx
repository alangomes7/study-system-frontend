import { StudyClass } from '@/types/study-class';
import { Subscription } from '@/types/subscription';
import Link from 'next/link';

async function getStudyClass(id: string): Promise<StudyClass> {
  const response = await fetch(`http://localhost:8080/study-classes/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch study class details');
  }
  return response.json();
}

async function getSubscriptions(studyClassId: string): Promise<Subscription[]> {
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

export default async function StudyClassDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const studyClass = await getStudyClass(id);
    const subscriptions = await getSubscriptions(id);

    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8'>
          <h1 className='text-3xl font-bold mb-2'>{studyClass.classCode}</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
            <p>
              <strong>Course:</strong> {studyClass.courseName}
            </p>
            <p>
              <strong>Professor:</strong>{' '}
              {studyClass.professorName || 'Not Assigned'}
            </p>
            <p>
              <strong>Year:</strong> {studyClass.year}
            </p>
            <p>
              <strong>Semester:</strong> {studyClass.semester}
            </p>
          </div>
        </div>

        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>Enrolled Students</h2>
          <Link
            href='/subscriptions'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          >
            Enroll Student
          </Link>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <thead>
              <tr className='bg-gray-100 dark:bg-gray-700'>
                <th className='py-2 px-4 border-b'>Student Name</th>
                <th className='py-2 px-4 border-b'>Subscription Date</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map(subscription => (
                  <tr
                    key={subscription.id}
                    className='hover:bg-gray-100 dark:hover:bg-gray-700'
                  >
                    <td className='py-2 px-4 border-b text-center'>
                      {subscription.studentName}
                    </td>
                    <td className='py-2 px-4 border-b text-center'>
                      {new Date(subscription.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className='py-4 px-4 text-center text-gray-500'
                  >
                    No students are enrolled in this class.
                  </td>
                </tr>
              )}
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
