export interface Course {
  id: number;
  name: string;
  description: string;
}

export type CourseCreationData = {
  name: string;
  description: string;
};
