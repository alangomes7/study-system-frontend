'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import { Subscription, Student, SubscriptionCreationData } from '@/types';

export const useGetSubscriptionsByStudyClass = (
  studyClassId: number | null,
) => {
  return useQuery<Subscription[], Error>({
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
    queryFn: () => api.getSubscriptionsByStudyClass(studyClassId!),
    enabled: !!studyClassId,
  });
};

/**
 * A hook that uses the result of `useGetSubscriptionsByStudyClass`
 * to fetch the details of all enrolled students.
 */
export const useGetStudentsByStudyClass = (studyClassId: number | null) => {
  // First, fetch the subscriptions
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClassId);

  // Then, use those subscriptions to fetch the students
  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<Student[], Error>({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: () => api.getStudentsInBatches(subscriptions!),
    enabled: !!subscriptions && subscriptions.length > 0,
  });

  return {
    data: subscriptions?.length === 0 ? [] : students,
    isLoading: isLoadingSubscriptions || isLoadingStudents,
    error: subscriptionsError || studentsError,
  };
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation<Subscription, Error, SubscriptionCreationData>({
    mutationFn: api.createSubscription,
    onSuccess: data => {
      // Invalidate subscriptions, which will auto-refetch students
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionsByClass(data.studyClassId),
      });
    },
  });
};
