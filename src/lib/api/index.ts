/**
 * Central export hub for application APIs.
 *
 * This file re-exports all API-related functions and definitions
 * from the core API modules, providing a single entry point for
 * importing them across the application. This approach keeps
 * imports cleaner and helps maintain an organized project structure.
 *
 * Exports:
 *  - All API functions and definitions
 */

export * from './course';
export * from './studyClass';
export * from './professor';
export * from './student';
export * from './subscription';
export * from './userApp';
export * from './auth';
export * from './ApiError';
