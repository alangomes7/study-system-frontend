import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const TOKEN_COOKIE_NAME = 'token';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, finalOptions);

  // Handle Authentication Errors (401/403)
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Add a query param to the login URL so the client knows why they were redirected
      const reason = response.status === 401 ? 'unauthorized' : 'forbidden';

      redirect(`/authentication/login?error=${reason}`);
    }
  }

  return response;
}
