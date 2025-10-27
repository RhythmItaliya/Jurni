import type { AxiosError } from 'axios';

/**
 * Extract a server-friendly error message from axios or generic errors
 * Handles various error response formats from the API
 *
 * @param error - The error object from axios or other sources
 * @returns A user-friendly error message string, or undefined if none found
 */
export function extractServerMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const maybeAxios = error as AxiosError<Record<string, unknown>>;
    const resp = maybeAxios.response;
    if (resp && resp.data && typeof resp.data === 'object') {
      const d = resp.data as Record<string, unknown>;
      if ('message' in d && typeof d.message === 'string') return d.message;
      if ('error' in d && typeof d.error === 'string') return d.error;
      // fallback to stringifying the object
      try {
        return JSON.stringify(d);
      } catch {
        return String(d);
      }
    }
  }

  return (error as { message?: string })?.message;
}
