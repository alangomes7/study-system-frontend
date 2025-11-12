'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import {
  Student,
  CreateStudentOptions,
  StudentCreationData,
  Professor,
} from '@/types';
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
      router.push(`/students/${data.id}`);
    },
  });
};

/**
 * Hook for updating an existing student.
 */
export const useUpdateStudent = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: studentData => api.updateStudent(id, studentData),
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.student(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      router.push(`/students/${id}`);
    },
  });
};

// /**
//  * Hook for updating an existing professor.
//  * (This is a logical place to add it for completeness)
//  */
// export const useUpdateProfessor = (id: number) => {
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   return useMutation<Professor, Error, StudentCreationData>({
//     mutationFn: professorData => api.updateProfessor(id, professorData),
//     onSuccess: data => {
//       queryClient.setQueryData(queryKeys.professor(id), data);
//       queryClient.invalidateQueries({ queryKey: queryKeys.professors });
//       router.push(`/professors/${id}`);
//     },
//   });
// };
