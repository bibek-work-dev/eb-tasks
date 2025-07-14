import { ApiResponse } from '../types/response';

export function createApiResponse<T>(
  message: string,
  data: T | null,
): ApiResponse<T> {
  return { message, data };
}
