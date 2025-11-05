/**
 * Central export hub for all application schemas.
 *
 * This file re-exports schema definitions from individual modules
 * to simplify imports across the application. Instead of importing
 * each schema directly from its file, other modules can import them
 * all from this single entry point.
 *
 * Exports:
 *  - Course schema from `course-schema.ts`
 *  - Study class schema from `study-class-schema.ts`
 *  - User schema from `user-schema.ts`
 */

// Export schema from course-schema.ts
export * from './course-schema';

// Export schema from study-class-schema.ts
export * from './study-class-schema';

// Export schema from user-schema.ts
export * from './user-schema';
