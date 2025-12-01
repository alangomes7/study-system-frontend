'use client';

import { queryKeys } from './queryKeys';
import { Course, CourseCreationData, CreateCourseOptions } from '@/types';
import { useApi } from './useApi';

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

export const useCreateCourse = (options?: CreateCourseOptions) => {
  return useApi<Course, CourseCreationData>({
    endpoint: COURSE_ENDPOINT,
    queryKey: queryKeys.courses,
  }).useCreate(options);
};
