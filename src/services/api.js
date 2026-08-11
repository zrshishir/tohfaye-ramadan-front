/**
 * The app's single HTTP client.
 *
 * Every screen used to build its own request with `import.meta.env.VITE_BASE_URL`
 * interpolated inline. That meant no shared timeout, no shared error handling, and
 * nothing stopping a screen from using a relative path by mistake — which is exactly
 * how the Hadith and Masala screens shipped broken, since a relative URL resolves
 * against `capacitor://localhost` in a native build.
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

if (!baseURL) {
  // Vite inlines env values at build time, so a missing value is a build-time
  // mistake, not something recoverable at runtime. Fail loudly.
  console.error(
    'VITE_BASE_URL is not set. Copy .env.example to .env and rebuild — ' +
    'Vite inlines env values at build time, so restarting the app is not enough.'
  );
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

/**
 * Attach the token when signed in.
 *
 * Read straight from localStorage rather than importing the auth service: auth.js
 * imports this module, so importing it back would be circular.
 */
api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('auth') ?? 'null')?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // A corrupt auth entry just means an unauthenticated request.
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise the shapes a screen might have to deal with, so `appMessage` is
    // always present and `status` is always a number or null.
    if (error.response) {
      error.status = error.response.status;
      error.appMessage = error.response.data?.message || `Request failed (${error.status}).`;
      // Validation errors carry per-field messages the auth screens surface.
      error.errors = error.response.data?.errors ?? null;

      // A rejected token means the session is over — drop it so the app returns to
      // guest mode rather than retrying with something the server has revoked.
      if (error.status === 401 && localStorage.getItem('auth')) {
        localStorage.removeItem('auth');
      }
    } else if (error.code === 'ECONNABORTED') {
      error.status = null;
      error.appMessage = 'The request timed out.';
    } else {
      error.status = null;
      error.appMessage = 'Could not reach the server.';
    }
    return Promise.reject(error);
  }
);

/**
 * Unwrap the API's `{ status, statusCode, message, data }` envelope.
 *
 * A 204 carries no body at all, so `response.data` is an empty string rather than an
 * envelope — every caller has to special-case it. This does it in one place.
 */
export function unwrap(response, fallback = []) {
  if (response.status === 204) return fallback;
  return response.data?.data ?? fallback;
}

export default api;
