'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useApi from './useApi';
import {
  StudyClass,
  CreateStudyClassOptions,
  StudyClassCreationData,
} from '@/types';

export const useGetAllStudyClasses = () => {
  const { findAll } = useApi<StudyClass>('/study-classes');
  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClasses,
    queryFn: () => findAll(),
  });
};

export const useGetStudyClass = (id: number) => {
  const { findById } = useApi<StudyClass>('/study-classes');
  return useQuery<StudyClass, Error>({
    queryKey: queryKeys.studyClass(id),
    queryFn: () => findById(id),
    enabled: !!id,
  });
};

export const useGetStudyClassesByCourse = (courseId: number) => {
  // Accessing a sub-resource manually
  const { fetchWithAuth, baseUrl } = useApi<StudyClass>('/study-classes');

  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClassesByCourse(courseId),
    queryFn: async () => {
      const response = await fetchWithAuth(`${baseUrl}/course/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch study classes');
      return response.json();
    },
    enabled: !!courseId,
  });
};

export const useCreateStudyClass = (options?: CreateStudyClassOptions) => {
  const queryClient = useQueryClient();
  const { create } = useApi<StudyClass>('/study-classes');

  return useMutation<StudyClass, Error, StudyClassCreationData>({
    ...options,
    mutationFn: data => create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studyClasses });
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};

export const useEnrollProfessor = () => {
  const queryClient = useQueryClient();
  const { fetchWithAuth, baseUrl } = useApi<StudyClass>('/study-classes');

  return useMutation<
    StudyClass,
    Error,
    { studyClassId: number; professorId: number }
  >({
    mutationFn: async variables => {
      const response = await fetchWithAuth(
        `${baseUrl}/\${variables.studyClassId}/professor`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            professorId: variables.professorId,
          }),
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
