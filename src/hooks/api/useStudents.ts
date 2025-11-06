'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import { Student, CreateStudentOptions, StudentCreationData } from '@/types';
import { useRouter } from 'next/navigation';

export const useGetAllStudents = () => {
  return useQuery<Student[], Error>({
    queryKey: queryKeys.students,
    queryFn: api.getAllStudents,
  });
};

export const useGetStudent = (id: number) => {
  return useQuery<Student, Error>({
    queryKey: queryKeys.student(id),
    queryFn: () => api.getStudent(id),
    enabled: !!id,
  });
};

export const useCreateStudent = (options?: CreateStudentOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: api.createStudent,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      options?.onSuccess?.(data, variables, context);
      router.push('/students');
    },
  });
};
