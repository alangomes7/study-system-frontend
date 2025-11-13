'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import {
  Professor,
  CreateProfessorOptions,
  ProfessorCreationData,
} from '@/types';
import { useRouter } from 'next/navigation';

export const useGetProfessors = () => {
  return useQuery<Professor[], Error>({
    queryKey: queryKeys.professors,
    queryFn: api.getProfessors,
  });
};

export const useGetProfessor = (id: number) => {
  return useQuery<Professor, Error>({
    queryKey: queryKeys.professor(id),
    queryFn: () => api.getProfessor(id),
    enabled: !!id,
  });
};

export const useCreateProfessor = (options?: CreateProfessorOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Professor, Error, ProfessorCreationData>({
    mutationFn: api.createProfessor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push('/professors'); // Changed from '/'

      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook for updating an existing professor.
 */
export const useUpdateProfessor = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Professor, Error, ProfessorCreationData>({
    mutationFn: professorData => api.updateProfessor(id, professorData),
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.professor(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push(`/professors/${id}`);
    },
  });
};
