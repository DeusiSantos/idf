import { isAxiosError } from "axios";
import api from "@/service/api";
import { ApiError } from "@/modules/idf/types";

/** Cliente axios partilhado (baseURL "/api/") — endpoints IDF ficam sob "idf/...". */
export const http = api;

/**
 * Envolve uma chamada axios e traduz falhas (incl. ProblemDetails do backend) para `ApiError`,
 * o formato que toda a UI do módulo IDF já sabe interpretar (WorkflowActions, mutations, etc.).
 */
export async function call<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const problem = error.response?.data as
        | { title?: string; detail?: string; status?: number; errors?: Record<string, string[]> }
        | undefined;
      throw new ApiError({
        status: problem?.status ?? error.response?.status,
        title: problem?.title,
        detail: problem?.detail ?? (!error.response ? "Sem ligação ao servidor." : undefined),
        errors: problem?.errors,
      });
    }
    throw error;
  }
}

/** Remove chaves undefined/vazias dos query params (evita "?Status=&Page=" na URL). */
export function cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  const clean: Partial<T> = {};
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") clean[key] = value;
  }
  return clean;
}
