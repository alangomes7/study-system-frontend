'use client';

import { useDeleteSubscriptionStore } from '@/stores/deleteSubscription';
import { useDeleteSubscription } from '@/hooks';
import { toast } from 'react-toastify';

export function useDeleteSubscriptionHandlers() {
  const store = useDeleteSubscriptionStore();
  const { mutateAsync: deleteSub, isPending: isDeleting } =
    useDeleteSubscription();

  const handleSelectCourse = (id: number) => store.setSelectedCourseId(id);
  const handleSelectClass = (id: number) => store.setSelectedStudyClassId(id);
  const handleSelectSubscription = (id: number) =>
    store.setSelectedSubscriptionId(id);

  const toggleDropdown = (type: 'course' | 'class' | 'subscription') => {
    store.setOpenDropdown(store.openDropdown === type ? null : type);
  };

  const handleDelete = async () => {
    if (!store.selectedSubscriptionId) return;

    if (
      confirm('Are you sure you want to remove this student from the class?')
    ) {
      try {
        await deleteSub(store.selectedSubscriptionId);
        toast.success('Subscription removed successfully');
        store.setSelectedSubscriptionId(null);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to remove subscription';
        toast.error(message);
      }
    }
  };

  return {
    handleSelectCourse,
    handleSelectClass,
    handleSelectSubscription,
    toggleDropdown,
    handleDelete,
    isDeleting,
  };
}
