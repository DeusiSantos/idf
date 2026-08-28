import { ApiError } from "@/modules/idf/types";

/** Lança ProblemDetails 400 com erros por campo quando houver. */
export const validate = (errors: Record<string, string[] | undefined>) => {
  const clean = Object.fromEntries(Object.entries(errors).filter(([, v]) => v && v.length)) as Record<
    string,
    string[]
  >;
  if (Object.keys(clean).length) {
    throw new ApiError({ status: 400, title: "Validação", errors: clean });
  }
};

export const required = (value: unknown, message: string) =>
  value === undefined || value === null || String(value).trim() === "" ? [message] : undefined;

export const positive = (value: number | undefined, message: string) =>
  !value || Number(value) <= 0 ? [message] : undefined;

export const notFound = (label: string): never => {
  throw new ApiError({ status: 404, detail: `${label} não encontrado.` });
};

export const businessRule = (message: string): never => {
  throw new ApiError({ status: 400, detail: message });
};

export const touch = <T extends { updatedAt?: string }>(entity: T) => {
  entity.updatedAt = new Date().toISOString();
  return entity;
};

/** Gera código sequencial legível, ex.: LIC-2026-004. */
export const nextCode = (prefix: string, existing: { code: string }[]) => {
  const year = new Date().getFullYear();
  const sequence = existing.filter((e) => e.code?.includes(`${prefix}-${year}`)).length + 1;
  return `${prefix}-${year}-${String(sequence).padStart(3, "0")}`;
};
