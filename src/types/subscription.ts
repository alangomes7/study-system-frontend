import { Student } from './student';

export interface Subscription {
  id: number;
  date: string;
  student: Student;
  studyClassId: number;
  classCode: string;
}
