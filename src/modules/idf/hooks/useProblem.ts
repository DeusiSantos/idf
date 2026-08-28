import { ApiError, type ProblemDetails } from "@/modules/idf/types";

/** Normaliza qualquer erro para ProblemDetails (secção 6). */
export const toProblem = (error: unknown): ProblemDetails => {
  if (error instanceof ApiError) return error.problem;
  return { detail: error instanceof Error ? error.message : "Ocorreu um erro inesperado." };
};

export const fieldError = (errors: Record<string, string[]> | undefined, field: string) => errors?.[field]?.[0];
