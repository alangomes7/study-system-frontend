'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useApi from './useApi';
import { Student, CreateStudentOptions, StudentCreationData } from '@/types';
import { useRouter } from 'next/navigation';

export const useGetAllStudents = () => {
  const { findAll } = useApi<Student>('/students');
  return useQuery<Student[], Error>({
    queryKey: queryKeys.students,
    queryFn: () => findAll(),
  });
};

export const useGetStudent = (id: number) => {
  const { findById } = useApi<Student>('/students');
  return useQuery<Student, Error>({
    queryKey: queryKeys.student(id),
    queryFn: () => findById(id),
    enabled: !!id,
  });
};

export const useCreateStudent = (options?: CreateStudentOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { create } = useApi<Student>('/students');

  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: data => create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      options?.onSuccess?.(data, variables, context);
      router.push(`/students/\${data.id}`);
    },
  });
};

export const useUpdateStudent = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { update } = useApi<Student>('/students');

  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: studentData => update(id, studentData),
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.student(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      router.push(`/students/\${id}`);
    },
  });
};
