/**
 * This file wraps all the functions from `api.ts` in React Query hooks.
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as api from './api';
import {
  Course,
  CourseCreationData,
  CreateCourseOptions,
} from '@/types/course';
import {
  CreateProfessorOptions,
  Professor,
  ProfessorCreationData,
} from '@/types/professor';
import {
  CreateStudentOptions,
  Student,
  StudentCreationData,
} from '@/types/student';
import {
  CreateStudyClassOptions,
  StudyClass,
  StudyClassCreationData,
} from '@/types/study-class';
import { Subscription, SubscriptionCreationData } from '@/types/subscription';

// --- Query Keys ---
// We define query keys here to keep them consistent
const queryKeys = {
  courses: ['courses'],
  // Changed id to number
  course: (id: number) => ['courses', id],
  studyClasses: ['studyClasses'],
  studyClass: (id: number) => ['studyClasses', id],
  // Changed courseId to number
  studyClassesByCourse: (courseId: number) => [
    'studyClasses',
    'byCourse',
    courseId,
  ],
  professors: ['professors'],
  students: ['students'],
  student: (id: number) => ['students', id],
  subscriptionsByClass: (studyClassId: number | null) => [
    'subscriptions',
    'byClass',
    studyClassId,
  ],
  studentsBySubscriptions: (subscriptionIds: number[] | undefined) => [
    'students',
    'bySubscriptions',
    subscriptionIds,
  ],
};

/* -------------------------------------------------------------------------- */
/* COURSES                                  */
/* -------------------------------------------------------------------------- */

export const useGetCourses = () => {
  return useQuery<Course[], Error>({
    queryKey: queryKeys.courses,
    queryFn: api.getCourses,
  });
};

// Changed id to number
export const useGetCourse = (id: number) => {
  return useQuery<Course, Error>({
    queryKey: queryKeys.course(id),
    // Call api.getCourse with a string as it expects
    queryFn: () => api.getCourse(String(id)),
    enabled: !!id,
  });
};

export const useCreateCourse = (options?: CreateCourseOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, CourseCreationData>({
    mutationFn: api.createCourse,

    onSuccess: (data, variables, context) => {
      // 1. Your hook's internal logic
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });

      // 2. Call the callback passed from the component
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      // 1. Call the callback passed from the component
      options?.onError?.(error, variables, context);
    },
  });
};

/* -------------------------------------------------------------------------- */
/* STUDY CLASSES                               */
/* -------------------------------------------------------------------------- */

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

// Changed courseId to number
export const useGetStudyClassesByCourse = (courseId: number) => {
  return useQuery<StudyClass[], Error>({
    queryKey: queryKeys.studyClassesByCourse(courseId),
    // Call api.getStudyClassesByCourse with a string as it expects
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
    StudyClass, // Updated return type from void to StudyClass
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

/* -------------------------------------------------------------------------- */
/* PROFESSORS                                 */
/* -------------------------------------------------------------------------- */

export const useGetProfessors = () => {
  return useQuery<Professor[], Error>({
    queryKey: queryKeys.professors,
    queryFn: api.getProfessors,
  });
};

export const useCreateProfessor = (options?: CreateProfessorOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Professor, Error, ProfessorCreationData>({
    mutationFn: api.createProfessor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push('/professors');

      options?.onSuccess?.(data, variables, context);
    },
  });
};

/* -------------------------------------------------------------------------- */
/* STUDENTS                                  */
/* -------------------------------------------------------------------------- */

export const useGetAllStudents = () => {
  return useQuery<Student[], Error>({
    queryKey: queryKeys.students,
    queryFn: api.getAllStudents,
  });
};

export const useGetStudent = (id: number) => {
  return useQuery<Student, Error>({
    queryKey: queryKeys.student(id),
    queryFn: () => api.getStudent(id),
    enabled: !!id,
  });
};

export const useCreateStudent = (options?: CreateStudentOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: api.createStudent,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTIONS & RELATED LOGIC               */
/* -------------------------------------------------------------------------- */

export const useGetSubscriptionsByStudyClass = (
  studyClassId: number | null,
) => {
  return useQuery<Subscription[], Error>({
    queryKey: queryKeys.subscriptionsByClass(studyClassId),
    queryFn: () => api.getSubscriptionsByStudyClass(studyClassId!),
    enabled: !!studyClassId,
  });
};

/**
 * A hook that uses the result of `useGetSubscriptionsByStudyClass`
 * to fetch the details of all enrolled students.
 */
export const useGetStudentsByStudyClass = (studyClassId: number | null) => {
  // First, fetch the subscriptions
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClassId);

  // Then, use those subscriptions to fetch the students
  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<Student[], Error>({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: () => api.getStudentsInBatches(subscriptions!),
    enabled: !!subscriptions && subscriptions.length > 0,
  });

  return {
    data: subscriptions?.length === 0 ? [] : students,
    isLoading: isLoadingSubscriptions || isLoadingStudents,
    error: subscriptionsError || studentsError,
  };
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation<Subscription, Error, SubscriptionCreationData>({
    mutationFn: api.createSubscription,
    onSuccess: data => {
      // Invalidate subscriptions, which will auto-refetch students
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionsByClass(data.studyClassId),
      });
    },
  });
};
