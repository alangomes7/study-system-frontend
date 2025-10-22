import { Student } from '@/types/student';

async function getStudent(id: string): Promise<Student> {
  const response = await fetch(`http://localhost:8080/students/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch student details');
  }
  return response.json();
}

export default async function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const student = await getStudent(id);

    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'>
          <h1 className='text-3xl font-bold mb-2'>{student.name}</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>CPF:</strong> {student.register}
            </p>
            <p>
              <strong>Phone Number:</strong> {student.phone}
            </p>
          </div>
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
