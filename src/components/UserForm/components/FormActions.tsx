import React from 'react';
import { DotsAnimation } from '@/components';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  disableSubmit: boolean;
  buttonLabel: string;
  inProgressLabel: string;
  hasErrors: boolean;
}

export const FormActions = ({
  onCancel,
  isSubmitting,
  disableSubmit,
  buttonLabel,
  inProgressLabel,
  hasErrors,
}: FormActionsProps) => {
  return (
    <div className='flex items-center gap-4 pt-2'>
      <button
        type='submit'
        className='btn btn-primary'
        onClick={() => {
          if (hasErrors) console.log('Submit blocked by errors');
        }}
        disabled={isSubmitting || disableSubmit}
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <DotsAnimation className='w-4 h-4' />
            {`${inProgressLabel}...`}
          </span>
        ) : (
          buttonLabel
        )}
      </button>

      <button
        type='button'
        onClick={onCancel}
        className='btn border border-border hover:bg-foreground/5'
        disabled={isSubmitting}
      >
        Cancel
      </button>
    </div>
  );
};
