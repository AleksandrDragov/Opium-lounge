import i18n, { currentLanguage } from '../i18n';

const API_URL = '/api';

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLanguage(), ...options.headers },
    });
  } catch {
    throw new ApiError(i18n.t('errors.network'), 0, 'network');
  }
  if (!response.ok) {
    const body: { code?: string; message?: string; capacity?: number } = await response.json().catch(() => ({}));
    const key = body.code && i18n.exists(`errors.${body.code}`) ? `errors.${body.code}` : 'errors.unknown';
    throw new ApiError(i18n.t(key, { capacity: body.capacity }), response.status, body.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
