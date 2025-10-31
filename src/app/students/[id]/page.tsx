import { getStudent } from '@/lib/api';
import Link from 'next/link';

export default async function StudentDetailsPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;

  try {
    const student = await getStudent(id);

    return (
      <div className='container mx-auto px-4 py-8 max-w-2xl'>
        <div className='flex justify-end mb-4'>
          <Link
            href='/students'
            className='btn border border-border hover:bg-foreground/5'
          >
            Back to List
          </Link>
        </div>

        <div className='card p-6'>
          <h1 className='text-3xl font-bold mb-4 text-foreground'>
            {student.name}
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
            <p className='text-foreground'>
              <strong>Email:</strong> {student.email}
            </p>
            <p className='text-foreground'>
              <strong>CPF:</strong> {student.register}
            </p>
            <p className='text-foreground'>
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
