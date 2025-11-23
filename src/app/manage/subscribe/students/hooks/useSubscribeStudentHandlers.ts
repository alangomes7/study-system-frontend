import { Student } from '@/types';
import {
  SortConfig,
  SubscriptionHandlers,
  SubscriptionHandlersParams,
} from '../types';

export function useSubscribeStudentHandlers({
  setSelectedCourseId,
  setSelectedStudyClassId,
  setSelectedStudentId,
  setOpenDropdown,
  setCurrentPage,
  setPaginationLength,
  setSortConfig,
  createSubscription,
}: SubscriptionHandlersParams): SubscriptionHandlers {
  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSelectedStudyClassId(null);
    setSelectedStudentId(null);
    setOpenDropdown(null);
  };

  const handleSelectStudyClass = (studyClassId: number) => {
    setSelectedStudyClassId(studyClassId);
    setOpenDropdown(null);
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setOpenDropdown(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    studentId: number | null,
    studyClassId: number | null,
  ) => {
    e.preventDefault();
    if (studentId && studyClassId) {
      await createSubscription(studentId, studyClassId);
    }
  };

  const requestSort = (
    key: keyof Student,
    sortConfig: SortConfig<Student> | null,
  ) => {
    let direction: SortConfig<Student>['direction'] = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePaginationLengthChange = (length: number) => {
    setPaginationLength(length);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    handleSelectCourse,
    handleSelectStudyClass,
    handleSelectStudent,
    handleSubmit,
    requestSort,
    handlePaginationLengthChange,
    paginate,
  };
}
