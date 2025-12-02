import React from 'react';

interface FormAlertsProps {
  apiError: { message: string } | null;
  errors: Record<string, string | string[]>;
}

export const FormAlerts = ({ apiError, errors }: FormAlertsProps) => {
  const hasValidationErrors = Object.keys(errors).length > 0;

  return (
    <>
      {apiError && (
        <div className='p-4 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-md'>
          <p className='font-bold'>Server Error:</p>
          <p>{apiError.message}</p>
        </div>
      )}

      {hasValidationErrors && (
        <div className='p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md shadow-sm'>
          <p className='font-bold flex items-center gap-2'>
            <span>⚠️</span> Please correct the following errors:
          </p>
          <ul className='list-disc list-inside mt-2 space-y-1'>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                <span className='capitalize font-semibold'>{key}:</span>{' '}
                {Array.isArray(error) ? error[0] : error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
