/**
 * Defines the possible dropdowns that can be open on the page.
 */
export type DropdownType =
  | 'course'
  | 'studyClass'
  | 'student'
  | 'pagination'
  | null;

/**
 * Defines the sorting configuration for a table.
 */
export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}
