/**
 * Defines the sorting configuration for a table.
 */
export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}
