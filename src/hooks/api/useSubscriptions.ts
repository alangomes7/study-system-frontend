'use client';

import {
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { Subscription, Student, SubscriptionCreationData } from '@/types';
import { useMemo } from 'react';
import { ApiError } from '@/lib/api';

const SUB_ENDPOINT = '/subscriptions';

export const useGetSubscriptionsByStudyClass = (
  studyClassId: number | null,
) => {
  const { raw } = useApi<Subscription>({
    endpoint: SUB_ENDPOINT,
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
  });

  return useQuery<Subscription[], ApiError>({
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
    queryFn: () => raw.findAll(studyClassId ? { studyClassId } : undefined),
    enabled: !!studyClassId,
  });
};

export const useGetStudentsByStudyClass = (studyClassId: number | null) => {
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClassId);

  const { raw: studentApi } = useApi<Student>({
    endpoint: '/students',
    queryKey: queryKeys.students,
  });

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<Student[], ApiError>({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: async () => {
      const studentIds = [
        ...new Set(
          subscriptions!
            .filter(sub => sub?.studentId)
            .map(sub => sub.studentId),
        ),
      ];
      return Promise.all(studentIds.map(id => studentApi.findById(id)));
    },
    enabled: !!subscriptions && subscriptions.length > 0,
  });

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

export const useCreateSubscription = (
  options?: UseMutationOptions<
    Subscription,
    ApiError,
    SubscriptionCreationData,
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  const { useCreate } = useApi<Subscription, SubscriptionCreationData>({
    endpoint: SUB_ENDPOINT,
    queryKey: 'subscriptions',
  });

  return useCreate({
    ...options,
    // Callback Corrected
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionsByClass(data.studyClassId),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteSubscription = (
  options?: UseMutationOptions<void, ApiError, number | string, unknown>,
) => {
  const { useDelete } = useApi<Subscription>({
    endpoint: SUB_ENDPOINT,
    queryKey: queryKeys.subscriptions,
  });

  return useDelete({
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
