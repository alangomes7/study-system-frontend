'use client';

import { UseMutationOptions } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { Course, CourseCreationData } from '@/types';
import { useApi } from './useApi';
import { ApiError } from '@/lib/api';

const COURSE_ENDPOINT = '/courses';

export const useGetCourses = () => {
  return useApi<Course, CourseCreationData>({
    endpoint: COURSE_ENDPOINT,
    queryKey: queryKeys.courses,
  }).useGetAll();
};

export const useGetCourse = (id: number) => {
  return useApi<Course>({
    endpoint: COURSE_ENDPOINT,
    queryKey: queryKeys.courses,
  }).useGetOne(id);
};

/**
 * Hook to create a course.
 * We explicitly use UseMutationOptions<Course, ApiError, CourseCreationData>
 * to ensure consumers know the error type is ApiError.
 */
export const useCreateCourse = (
  options?: UseMutationOptions<Course, ApiError, CourseCreationData>,
) => {
  return useApi<Course, CourseCreationData>({
    endpoint: COURSE_ENDPOINT,
    queryKey: queryKeys.courses,
  }).useCreate(options);
};
