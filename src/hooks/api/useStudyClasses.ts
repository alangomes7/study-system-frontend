'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import {
  StudyClass,
  CreateStudyClassOptions,
  StudyClassCreationData,
} from '@/types';

export const useGetAllStudyClasses = () => {
  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClasses,
    queryFn: api.getAllStudyClasses,
  });
};

export const useGetStudyClass = (id: number) => {
  return useQuery<StudyClass, Error>({
    queryKey: queryKeys.studyClass(id),
    queryFn: () => api.getStudyClass(id),
    enabled: !!id,
  });
};

export const useGetStudyClassesByCourse = (courseId: number) => {
  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClassesByCourse(courseId),
    queryFn: () => api.getStudyClassesByCourse(String(courseId)),
    enabled: !!courseId,
  });
};

export const useCreateStudyClass = (options?: CreateStudyClassOptions) => {
  const queryClient = useQueryClient();
  return useMutation<StudyClass, Error, StudyClassCreationData>({
    ...options,
    mutationFn: api.createStudyClass,
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
  return useMutation<
    StudyClass,
    Error,
    { studyClassId: number; professorId: number } // Input variables type
  >({
    mutationFn: variables =>
      api.enrollProfessorInStudyClass(
        variables.studyClassId,
        variables.professorId,
      ),
    onSuccess: (data, variables) => {
      // 'data' is the updated StudyClassDto returned from the backend
      // We can use it to immediately update the cache

      // Update the specific study class query cache
      queryClient.setQueryData(
        queryKeys.studyClass(variables.studyClassId),
        data,
      );

      // Invalidate the general study classes list
      queryClient.invalidateQueries({ queryKey: queryKeys.studyClasses });

      // Invalidate the study classes by course list, if it's in use
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });
    },
  });
};
