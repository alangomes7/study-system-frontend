import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Define the name of the cookie where your auth token is stored
const TOKEN_COOKIE_NAME = 'token'; // Update this to match your actual cookie name

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // 1. Retrieve the token from cookies (Server-side approach)
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  // 2. Prepare Headers
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure content-type exists if we have a body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  // 3. Perform the Fetch
  const response = await fetch(url, finalOptions);

  // 4. Handle Authentication Errors (401/403)
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // On the server, we cannot set global state (Zustand).
      // Instead, we redirect the user immediately.

      // Optional: Add a query param to the login URL so the client knows why they were redirected
      const reason = response.status === 401 ? 'unauthorized' : 'forbidden';

      redirect(`/authentication/login?error=${reason}`);
    }
  }

  // Return the raw response for the caller to handle specific data parsing
  return response;
}
