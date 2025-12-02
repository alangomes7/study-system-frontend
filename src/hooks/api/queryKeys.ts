export const queryKeys = {
  courses: ['courses'],
  course: (id: number) => ['courses', id],
  studyClasses: ['studyClasses'],
  studyClass: (id: number) => ['studyClasses', id],
  studyClassesByCourse: (courseId: number) => [
    'studyClasses',
    'byCourse',
    courseId,
  ],
  professors: ['professors'],
  professor: (id: number) => ['professors', id],
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
  userApps: ['userApps'],
  subscriptions: ['subscriptions'],
} as const;
