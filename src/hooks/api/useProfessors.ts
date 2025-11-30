'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useApi from '../../lib/api/useApi';
import {
  Professor,
  CreateProfessorOptions,
  ProfessorCreationData,
} from '@/types';
import { useRouter } from 'next/navigation';

export const useGetProfessors = () => {
  const { findAll } = useApi<Professor>('/professors');
  return useQuery<Professor[], Error>({
    queryKey: queryKeys.professors,
    queryFn: () => findAll(),
  });
};

export const useGetProfessor = (id: number) => {
  const { findById } = useApi<Professor>('/professors');
  return useQuery<Professor, Error>({
    queryKey: queryKeys.professor(id),
    queryFn: () => findById(id),
    enabled: !!id,
  });
};

export const useCreateProfessor = (options?: CreateProfessorOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { create } = useApi<Professor>('/professors');

  return useMutation<Professor, Error, ProfessorCreationData>({
    mutationFn: data => create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push('/professors');
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateProfessor = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { update } = useApi<Professor>('/professors');

  return useMutation<Professor, Error, ProfessorCreationData>({
    mutationFn: professorData => update(id, professorData),
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.professor(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push(`/professors/\${id}`);
    },
  });
};
