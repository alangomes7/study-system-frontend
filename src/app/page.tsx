/**
 * Home page component
 * Displays an "under construction" message.
 */
export default function Home() {
  return (
    <div className='font-sans flex items-center justify-center min-h-screen p-8'>
      <main className='flex flex-col items-center'>
        <h1 className='text-2xl font-semibold text-gray-700 dark:text-gray-200'>
          This website is on building
        </h1>
      </main>
    </div>
  );
}
