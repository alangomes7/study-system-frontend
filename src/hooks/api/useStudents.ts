'use client';

import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { Student, StudentCreationData } from '@/types';
import { useRouter } from 'next/navigation';
import { UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';

const STUDENT_ENDPOINT = '/students';

export const useGetAllStudents = () => {
  return useApi<Student>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useGetAll();
};

export const useGetStudent = (id: number) => {
  return useApi<Student>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useGetOne(id);
};

export const useCreateStudent = (
  options?: UseMutationOptions<Student, ApiError, StudentCreationData, unknown>,
) => {
  const router = useRouter();

  return useApi<Student, StudentCreationData>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useCreate({
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      router.push(`/students/${data.id}`);
    },
  });
};

export const useUpdateStudent = (id: number) => {
  const router = useRouter();
  const { useUpdate } = useApi<Student, StudentCreationData>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  });

  const mutation = useUpdate({
    onSuccess: () => {
      router.push(`/students/${id}`);
    },
  });

  return {
    ...mutation,
    mutate: (data: StudentCreationData) => mutation.mutate({ id, data }),
    mutateAsync: (data: StudentCreationData) =>
      mutation.mutateAsync({ id, data }),
  };
};

export const useDeleteStudent = (
  options?: UseMutationOptions<void, ApiError, number | string, unknown>,
) => {
  return useApi<Student>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useDelete(options);
};
