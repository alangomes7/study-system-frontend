'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useDeleteSubscriptionData } from '../hooks/useDeleteSubscriptionData';
import { useDeleteSubscriptionHandlers } from '../hooks/useDeleteSubscriptionHandlers';

export function SubscriptionDropdown() {
  const {
    subscriptions,
    selectedSubscription,
    selectedStudyClassId,
    openDropdown,
    isLoading,
  } = useDeleteSubscriptionData();
  const { handleSelectSubscription, toggleDropdown } =
    useDeleteSubscriptionHandlers();

  const isDisabled = !selectedStudyClassId || isLoading;

  return (
    <div className='relative'>
      <label className='labelForm'>Student to Remove</label>
      <button
        type='button'
        onClick={() => toggleDropdown('subscription')}
        disabled={isDisabled}
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span>
          {selectedSubscription?.studentName || '-- Select Student --'}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4',
            openDropdown === 'subscription' && 'rotate-180',
          )}
        />
      </button>

      {openDropdown === 'subscription' && (
        <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {subscriptions.length > 0 ? (
            subscriptions.map(sub => (
              <li
                key={sub.id}
                onClick={() => handleSelectSubscription(sub.id)}
                className='px-3 py-2 cursor-pointer hover:bg-error/10 hover:text-error transition-colors'
              >
                {sub.studentName} (Enrolled:{' '}
                {new Date(sub.date).toLocaleDateString()})
              </li>
            ))
          ) : (
            <li className='px-3 py-2 text-muted-foreground italic'>
              No students enrolled in this class
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
