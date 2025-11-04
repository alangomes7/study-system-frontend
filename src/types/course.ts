export interface Course {
  id: number;
  name: string;
  description: string;
}

export type CourseCreationData = {
  name: string;
  description: string;
};

export type CreateCourseOptions = {
  onSuccess?: (
    data: Course,
    variables: CourseCreationData,
    context: unknown,
  ) => void;
  onError?: (
    error: Error,
    variables: CourseCreationData,
    context: unknown,
  ) => void;
};
