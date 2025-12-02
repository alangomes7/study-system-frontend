'use client';

import { useDeleteSubscriptionStore } from '@/stores/deleteSubscription';
import { useDeleteSubscription } from '@/hooks';
import { DialogPopup } from '@/components';
import { ApiError } from '@/lib/api';

export function useDeleteSubscriptionHandlers() {
  const selectedSubscriptionId = useDeleteSubscriptionStore(
    s => s.selectedSubscriptionId,
  );
  const openDropdown = useDeleteSubscriptionStore(s => s.openDropdown);

  const setSelectedCourseId = useDeleteSubscriptionStore(
    s => s.setSelectedCourseId,
  );
  const setSelectedStudyClassId = useDeleteSubscriptionStore(
    s => s.setSelectedStudyClassId,
  );
  const setSelectedSubscriptionId = useDeleteSubscriptionStore(
    s => s.setSelectedSubscriptionId,
  );
  const setOpenDropdown = useDeleteSubscriptionStore(s => s.setOpenDropdown);

  const { mutateAsync: deleteSub, isPending: isDeleting } =
    useDeleteSubscription();

  const handleSelectCourse = (id: number) => setSelectedCourseId(id);
  const handleSelectClass = (id: number) => setSelectedStudyClassId(id);
  const handleSelectSubscription = (id: number) =>
    setSelectedSubscriptionId(id);

  const toggleDropdown = (type: 'course' | 'class' | 'subscription') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const executeDelete = async () => {
    if (!selectedSubscriptionId) return;

    try {
      await deleteSub(selectedSubscriptionId);

      DialogPopup.success('Subscription removed successfully');

      setSelectedSubscriptionId(null);
      setOpenDropdown(null);
    } catch (error: unknown) {
      let errorMessage = 'Failed to remove subscription';

      if (error instanceof ApiError) {
        errorMessage = error.response?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      DialogPopup.error(errorMessage);
    }
  };

  const handleDelete = () => {
    if (!selectedSubscriptionId) return;

    DialogPopup.confirm(
      'Are you sure you want to unenroll this student? This action cannot be undone.',
      confirmation => {
        if (confirmation) {
          void executeDelete();
        }
      },
    );
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
