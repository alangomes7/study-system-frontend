/**
 * Central export hub for animation components.
 *
 * This file re-exports all reusable UI animation used across
 * the application, providing a single entry point for imports.
 * This keeps imports cleaner and the project structure organized.
 *
 * Exports:
 *  - SpinLoader
 *  - ErrorAnimation
 */

export { default as SpinLoaderAnimation } from './SpinLoaderAnimation';
export { default as ErrorAnimation } from './ErrorAnimation';
export { default as NotFoundAnimation } from './NotFoundAnimation';
export { default as DotsAnimation } from './DotsAnimation';
