'use client';

import { type ToastContentProps } from 'react-toastify';
import { Check, X } from 'lucide-react';
import ToastActionButton from './ToastActionButton';

export default function ToastConfirmation({
  closeToast,
  data,
}: ToastContentProps<string>) {
  return (
    <div className='flex flex-col gap-3 p-4'>
      <p className='text-sm font-medium text-foreground leading-snug'>{data}</p>

      <div className='flex items-center justify-center gap-2'>
        <ToastActionButton
          onClick={() => closeToast && closeToast(true)}
          icon={<Check size={18} />}
          variant='confirm'
          aria-label='Confirm action'
          title='Confirm'
        />
        <ToastActionButton
          onClick={() => closeToast && closeToast(false)}
          icon={<X size={18} />}
          variant='cancel'
          aria-label='Cancel action'
          title='Cancel'
        />
      </div>
    </div>
  );
}
