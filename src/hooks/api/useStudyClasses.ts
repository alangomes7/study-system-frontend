'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import {
  StudyClass,
  CreateStudyClassOptions,
  StudyClassCreationData,
} from '@/types';

const ENDPOINT = '/study-classes';

export const useGetAllStudyClasses = () => {
  return useApi<StudyClass>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  }).useGetAll();
};

export const useGetStudyClass = (id: number) => {
  return useApi<StudyClass>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  }).useGetOne(id);
};

export const useGetStudyClassesByCourse = (courseId: number) => {
  const { raw } = useApi<StudyClass>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  });

  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClassesByCourse(courseId),
    queryFn: async () => {
      const response = await raw.fetchWithAuth(
        `${raw.baseUrl}/course/${courseId}`,
      );
      if (!response.ok) throw new Error('Failed to fetch study classes');
      return response.json();
    },
    enabled: !!courseId,
  });
};

export const useCreateStudyClass = (options?: CreateStudyClassOptions) => {
  const queryClient = useQueryClient();
  const { useCreate } = useApi<StudyClass, StudyClassCreationData>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  });

  return useCreate({
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate specific cache keys
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useEnrollProfessor = () => {
  const queryClient = useQueryClient();
  const { raw } = useApi<StudyClass>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  });

  return useMutation<
    StudyClass,
    Error,
    { studyClassId: number; professorId: number }
  >({
    mutationFn: async ({ studyClassId, professorId }) => {
      const response = await raw.fetchWithAuth(
        `${raw.baseUrl}/${studyClassId}/professor`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ professorId }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to assign professor');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.studyClass(variables.studyClassId),
        data,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.studyClasses });
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });
    },
  });
};
