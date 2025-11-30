'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useApi from '../../lib/api/useApi';
import { Subscription, Student, SubscriptionCreationData } from '@/types';
import { useMemo } from 'react';

export const useGetSubscriptionsByStudyClass = (
  studyClassId: number | null,
) => {
  const { findAll } = useApi<Subscription>('/subscriptions');

  return useQuery<Subscription[], Error>({
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
    queryFn: () => findAll(studyClassId ? { studyClassId } : undefined),
    enabled: !!studyClassId,
  });
};

/**
 * A hook that uses the result of \`useGetSubscriptionsByStudyClass\`
 * to fetch the details of all enrolled students.
 */
export const useGetStudentsByStudyClass = (studyClassId: number | null) => {
  // First, fetch the subscriptions
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClassId);

  // We need to fetch students individually or use a batch mechanism.
  // Since useApi is per-endpoint, we'll manually handle the batch logic here
  // or reuse the logic, but we must use the authenticated fetch.

  const { findById } = useApi<Student>('/students');

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<Student[], Error>({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: async () => {
      // Re-implementing batch logic using the authenticated findById
      const studentIds = [
        ...new Set(
          subscriptions!
            .filter(sub => sub?.studentId)
            .map(sub => sub.studentId),
        ),
      ];

      // Simple batch fetching (parallel)
      // Note: For large datasets, proper chunking (batchSize) might be needed as seen in original code.
      // Simplified here for brevity, or we could re-implement chunking.
      const promises = studentIds.map(id => findById(id));
      return Promise.all(promises);
    },
    enabled: !!subscriptions && subscriptions.length > 0,
  });

  // Merge subscription info into student data
  const studentsWithSubscription = useMemo(() => {
    if (!students || !subscriptions) return [];

    return students.map(student => {
      const subscription = subscriptions.find(
        sub => sub.studentId === student.id,
      );
      return {
        ...student,
        subscriptionId: subscription?.id,
        subscriptionDate: subscription?.date,
      };
    });
  }, [students, subscriptions]);

  return {
    data: subscriptions?.length === 0 ? [] : studentsWithSubscription,
    isLoading: isLoadingSubscriptions || isLoadingStudents,
    error: subscriptionsError || studentsError,
  };
};

export const useCreateSubscription = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { create } = useApi<Subscription>('/subscriptions');

  return useMutation<Subscription, Error, SubscriptionCreationData>({
    mutationFn: data => create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionsByClass(data.studyClassId),
      });
      options?.onSuccess?.();
    },
  });
};
