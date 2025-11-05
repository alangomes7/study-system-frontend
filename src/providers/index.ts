/**
 * Central export hub for application providers.
 *
 * This file re-exports the React Query provider component,
 * allowing it to be imported from a single entry point.
 * Keeping provider exports centralized helps maintain a clean
 * and organized structure across the application.
 *
 * Exports:
 *  - QueryProvider from `QueryProvider.tsx`
 */

// Export React Query provider
export { default as QueryProvider } from './QueryProvider';
