'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import { Course, CourseCreationData, CreateCourseOptions } from '@/types';

export const useGetCourses = () => {
  return useQuery<Course[], Error>({
    queryKey: queryKeys.courses,
    queryFn: api.getCourses,
  });
};

export const useGetCourse = (id: number) => {
  return useQuery<Course, Error>({
    queryKey: queryKeys.course(id),
    queryFn: () => api.getCourse(String(id)),
    enabled: !!id,
  });
};

export const useCreateCourse = (options?: CreateCourseOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, CourseCreationData>({
    mutationFn: api.createCourse,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
  });
};
