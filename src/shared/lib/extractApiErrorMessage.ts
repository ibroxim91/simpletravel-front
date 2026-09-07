import { AxiosError } from 'axios';

type ErrorPayload = {
  detail?: unknown;
  message?: unknown;
  non_field_errors?: unknown;
  phone?: unknown;
  email?: unknown;
  data?: {
    detail?: unknown;
    message?: unknown;
    non_field_errors?: unknown;
    phone?: unknown;
    email?: unknown;
  };
  [key: string]: unknown;
};

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) {
    return value[0].trim();
  }
  return undefined;
}

export function extractApiErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const payload = data as ErrorPayload;
  const nested = payload.data;

  const candidates: unknown[] = [
    payload.detail,
    payload.message,
    payload.non_field_errors,
    payload.phone,
    payload.email,
    nested?.detail,
    nested?.message,
    nested?.non_field_errors,
    nested?.phone,
    nested?.email,
  ];

  for (const candidate of candidates) {
    const text = firstString(candidate);
    if (text) return text;
  }

  for (const value of Object.values(payload)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) continue;
    const text = firstString(value);
    if (text) return text;
  }

  return undefined;
}

export const GENERIC_SERVER_ERROR_RU =
  'Что то пошло не так попробуйте позже...';

/** Prefer server 4xx message; use generic text for 5xx / network / unknown. */
export function resolveAuthErrorMessage(
  error: unknown,
  genericFallback: string = GENERIC_SERVER_ERROR_RU,
): string {
  const axiosError = error as AxiosError<unknown> & {
    status?: number;
    message?: string;
    response?: { status?: number; data?: unknown };
  };

  const status = axiosError.response?.status ?? axiosError.status;
  const data = axiosError.response?.data;

  if (!axiosError.response || (typeof status === 'number' && status >= 500)) {
    return genericFallback;
  }

  const extracted = extractApiErrorMessage(data);
  if (extracted) return extracted;

  if (axiosError.message && !axiosError.message.toLowerCase().includes('status code')) {
    return axiosError.message;
  }

  return genericFallback;
}
