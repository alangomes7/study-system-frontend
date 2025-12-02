'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { StudyClass, StudyClassCreationData } from '@/types';
import { ApiError } from '@/lib/api';

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

  return useQuery<StudyClass[], ApiError>({
    queryKey: queryKeys.studyClassesByCourse(courseId),
    queryFn: async () => {
      const response = await raw.fetchWithAuth(
        `${raw.baseUrl}/course/${courseId}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData);
      }
      return response.json();
    },
    enabled: !!courseId,
  });
};

export const useCreateStudyClass = (
  options?: UseMutationOptions<
    StudyClass,
    ApiError,
    StudyClassCreationData,
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  const { useCreate } = useApi<StudyClass, StudyClassCreationData>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.studyClasses,
  });

  return useCreate({
    ...options,
    // Callback Corrected (removed 'unknown' arg)
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
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
    ApiError,
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
        throw new ApiError(errorData);
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
