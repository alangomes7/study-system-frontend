'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { Subscription, Student, SubscriptionCreationData } from '@/types';
import { useMemo } from 'react';
import { deleteSubscription } from '@/lib/api';

const SUB_ENDPOINT = '/subscriptions';

export const useGetSubscriptionsByStudyClass = (
  studyClassId: number | null,
) => {
  const { raw } = useApi<Subscription>({
    endpoint: SUB_ENDPOINT,
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
  });

  return useQuery<Subscription[], Error>({
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
    queryFn: () => raw.findAll(studyClassId ? { studyClassId } : undefined),
    enabled: !!studyClassId,
  });
};

export const useGetStudentsByStudyClass = (studyClassId: number | null) => {
  // 1. Fetch subscriptions
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClassId);

  // 2. Fetch students using the raw API from the generic hook
  const { raw: studentApi } = useApi<Student>({
    endpoint: '/students',
    queryKey: queryKeys.students,
  });

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<Student[], Error>({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: async () => {
      const studentIds = [
        ...new Set(
          subscriptions!
            .filter(sub => sub?.studentId)
            .map(sub => sub.studentId),
        ),
      ];
      // Parallel fetch using the authenticated findById from the generic hook
      return Promise.all(studentIds.map(id => studentApi.findById(id)));
    },
    enabled: !!subscriptions && subscriptions.length > 0,
  });

  // 3. Merge Data
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
  const { useCreate } = useApi<Subscription, SubscriptionCreationData>({
    endpoint: SUB_ENDPOINT,
    queryKey: 'subscriptions',
  });

  return useCreate({
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionsByClass(data.studyClassId),
      });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      // Invalidate all subscriptions related queries
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};
