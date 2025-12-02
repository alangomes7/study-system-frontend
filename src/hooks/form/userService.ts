import { AnyUserCreationData } from './types';

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'An error occurred during the request.',
    );
  }
  return response.json();
};

// --- Student API ---

export const createStudent = async (data: AnyUserCreationData) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateStudent = async (
  id: number | string,
  data: AnyUserCreationData,
) => {
  const response = await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// --- Professor API ---

export const createProfessor = async (data: AnyUserCreationData) => {
  const response = await fetch('/api/professors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateProfessor = async (
  id: number | string,
  data: AnyUserCreationData,
) => {
  const response = await fetch(`/api/professors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// --- User App (Admin/User) API ---

export const createUserApp = async (data: AnyUserCreationData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
