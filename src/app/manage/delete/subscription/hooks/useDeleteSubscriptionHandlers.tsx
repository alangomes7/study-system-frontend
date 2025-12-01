'use client';

import { useDeleteSubscriptionStore } from '@/stores/deleteSubscription';
import { useDeleteSubscription } from '@/hooks';
import { DialogPopup } from '@/components';

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
      const response = await deleteSub(selectedSubscriptionId);

      const status = response?.status;
      const message = response?.message;

      if (status === 200) {
        DialogPopup.success('200');
        DialogPopup.success(message || 'Subscription removed successfully');
        setSelectedSubscriptionId(null);
        setOpenDropdown(null);
        return;
      }
      throw new Error(
        message ||
          `Failed to remove subscription (status: ${status ?? 'unknown'})`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to remove subscription';

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
