'use client';

import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { Student, CreateStudentOptions, StudentCreationData } from '@/types';
import { useRouter } from 'next/navigation';

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

export const useCreateStudent = (options?: CreateStudentOptions) => {
  const router = useRouter();

  return useApi<Student, StudentCreationData>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useCreate({
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
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

  // Wrapper to match previous signature (data only) -> (id + data)
  return {
    ...mutation,
    mutate: (data: StudentCreationData) => mutation.mutate({ id, data }),
    mutateAsync: (data: StudentCreationData) =>
      mutation.mutateAsync({ id, data }),
  };
};

export const useDeleteStudent = () => {
  return useApi<Student>({
    endpoint: STUDENT_ENDPOINT,
    queryKey: queryKeys.students,
  }).useDelete();
};
