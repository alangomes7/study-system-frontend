'use client';

import {
  useGetCourses,
  useGetStudyClassesByCourse,
  useGetSubscriptionsByStudyClass,
} from '@/hooks';
import { useDeleteSubscriptionStore } from '@/stores/deleteSubscription';

export function useDeleteSubscriptionData() {
  const store = useDeleteSubscriptionStore();

  // 1. Get Courses
  const { data: courses = [], isLoading: loadingCourses } = useGetCourses();

  // 2. Get Classes (Dependent)
  const { data: studyClasses = [], isLoading: loadingClasses } =
    useGetStudyClassesByCourse(store.selectedCourseId || 0);

  // 3. Get Subscriptions (Dependent)
  const { data: subscriptions = [], isLoading: loadingSubs } =
    useGetSubscriptionsByStudyClass(store.selectedStudyClassId || 0);

  // Derived
  const selectedCourse = courses.find(c => c.id === store.selectedCourseId);
  const selectedClass = studyClasses.find(
    c => c.id === store.selectedStudyClassId,
  );
  const selectedSubscription = subscriptions.find(
    s => s.id === store.selectedSubscriptionId,
  );

  return {
    ...store,
    courses,
    studyClasses,
    subscriptions,
    selectedCourse,
    selectedClass,
    selectedSubscription,
    isLoading: loadingCourses || loadingClasses || loadingSubs,
  };
}
