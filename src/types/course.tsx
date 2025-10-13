import { StudyClass } from './study-class';

export interface Course {
  id: string;
  name: string;
  description: string;
  studyClasses: StudyClass[];
}
