'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useApi from './useApi';
import { Course, CourseCreationData, CreateCourseOptions } from '@/types';

export const useGetCourses = () => {
  const { findAll } = useApi<Course>('/courses');
  return useQuery<Course[], Error>({
    queryKey: queryKeys.courses,
    queryFn: () => findAll(),
  });
};

export const useGetCourse = (id: number) => {
  const { findById } = useApi<Course>('/courses');
  return useQuery<Course, Error>({
    queryKey: queryKeys.course(id),
    queryFn: () => findById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = (options?: CreateCourseOptions) => {
  const queryClient = useQueryClient();
  const { create } = useApi<Course>('/courses');

  return useMutation<Course, Error, CourseCreationData>({
    mutationFn: data => create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
  });
};
