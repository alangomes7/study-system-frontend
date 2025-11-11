type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type DropdownType =
  | 'course'
  | 'studyClass'
  | 'student'
  | 'pagination'
  | null;

export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}

export interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  register: string;
}

export interface SubscriptionHandlersParams {
  setSelectedCourseId: SetState<number | null>;
  setSelectedStudyClassId: SetState<number | null>;
  setSelectedStudentId: SetState<number | null>;
  setOpenDropdown: SetState<DropdownType>;
  setCurrentPage: SetState<number>;
  setPaginationLength: SetState<number>;
  setSortConfig: SetState<SortConfig<Student> | null>;
  setStudentSearchTerm: SetState<string>;
  setTableSearchTerm: SetState<string>;
  createSubscription: (
    studentId: number,
    studyClassId: number,
  ) => Promise<void>;
}

export interface SubscriptionHandlers {
  handleSelectCourse: (courseId: number) => void;
  handleSelectStudyClass: (studyClassId: number) => void;
  handleSelectStudent: (studentId: number) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    studentId: number | null,
    studyClassId: number | null,
  ) => Promise<void>;
  requestSort: (
    key: keyof Student,
    sortConfig: SortConfig<Student> | null,
  ) => void;
  handlePaginationLengthChange: (length: number) => void;
  paginate: (pageNumber: number) => void;
}
