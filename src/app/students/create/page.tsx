'use client';

import { useCreateStudent } from '@/hooks/useStudents';

export default function CreateStudentPage() {
  const {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    register,
    setRegister,
    error,
    isSubmitting,
    handleSubmit,
  } = useCreateStudent();

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Create Student</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        {/* ... (form inputs) ... */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='border rounded-lg p-2 w-full'
            disabled={isSubmitting}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='phone'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Phone
          </label>
          <input
            type='text'
            id='phone'
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className='border rounded-lg p-2 w-full'
            disabled={isSubmitting}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='border rounded-lg p-2 w-full'
            disabled={isSubmitting}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='register'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Register (CPF)
          </label>
          <input
            type='text'
            id='register'
            value={register}
            onChange={e => setRegister(e.target.value)}
            className='border rounded-lg p-2 w-full'
            disabled={isSubmitting}
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
