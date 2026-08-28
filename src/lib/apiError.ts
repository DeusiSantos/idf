import { isAxiosError } from "axios";

/** Extrai uma mensagem legível de um erro da API (formato ProblemDetails do backend). */
export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  if (isAxiosError(error)) {
    const problem = error.response?.data as { title?: string; detail?: string; errors?: Record<string, string[]> } | undefined;
    if (problem?.errors) {
      const firstError = Object.values(problem.errors).flat()[0];
      if (firstError) return firstError;
    }
    if (problem?.detail) return problem.detail;
    if (problem?.title) return problem.title;
    if (error.response?.status === 401) return "Credenciais inválidas.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
