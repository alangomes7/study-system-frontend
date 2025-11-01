/**
 * This file wraps all the functions from `api.ts` in React Query hooks.
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as api from './api';
import { Course, CourseCreationData } from '@/types/course';
import { Professor } from '@/types/professor';
import { Student, StudentCreationData } from '@/types/student';
import { StudyClass, StudyClassCreationData } from '@/types/study-class';
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

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, CourseCreationData>({
    mutationFn: api.createCourse,
    onSuccess: () => {
      // Invalidate the 'courses' query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
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

export const useCreateStudyClass = () => {
  const queryClient = useQueryClient();
  return useMutation<StudyClass, Error, StudyClassCreationData>({
    mutationFn: api.createStudyClass,
    onSuccess: data => {
      // Invalidate both the general list and the specific course list
      queryClient.invalidateQueries({ queryKey: queryKeys.studyClasses });
      queryClient.invalidateQueries({
        // Pass number to the updated query key
        queryKey: queryKeys.studyClassesByCourse(data.courseId),
      });
    },
  });
};

export const useEnrollProfessor = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    // Changed types to number
    { studyClassId: number; professorId: number }
  >({
    mutationFn: variables =>
      api.enrollProfessorInStudyClass(
        variables.studyClassId,
        variables.professorId,
      ),
    onSuccess: (_, variables) => {
      // Refetch the specific study class details
      queryClient.invalidateQueries({
        queryKey: queryKeys.studyClass(variables.studyClassId),
      });
      // Also refetch the main list in case it's displayed
      queryClient.invalidateQueries({ queryKey: queryKeys.studyClasses });
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

export const useCreateProfessor = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Professor, Error, string>({
    mutationFn: api.createProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professors });
      router.push('/professors');
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

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<Student, Error, StudentCreationData>({
    mutationFn: api.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
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
  const { data: subscriptions, isLoading: isLoadingSubscriptions } =
    useGetSubscriptionsByStudyClass(studyClassId);

  // Then, use those subscriptions to fetch the students
  const { data: students, isLoading: isLoadingStudents } = useQuery<
    Student[],
    Error
  >({
    queryKey: queryKeys.studentsBySubscriptions(subscriptions?.map(s => s.id)),
    queryFn: () => api.getStudentsInBatches(subscriptions!),
    enabled: !!subscriptions && subscriptions.length > 0,
  });

  return {
    data: subscriptions?.length === 0 ? [] : students,
    isLoading: isLoadingSubscriptions || isLoadingStudents,
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
