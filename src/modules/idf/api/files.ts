import { call, http } from "@/modules/idf/api/http";

/** Contrato confirmado — ver guia "Frontend — Anexos (Operadores Florestais)" (secção 3). */
const UPLOAD_PATH = "files";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx", ".xls", ".xlsx"];
export const ALLOWED_FILE_ACCEPT = ALLOWED_FILE_EXTENSIONS.join(",");

export class FileValidationError extends Error {}

/** Falha cedo, sem chamar a API, quando o ficheiro não cumpre as regras do backend (secção 2). */
export const validateFileForUpload = (file: File): void => {
  if (file.size > MAX_SIZE_BYTES) {
    throw new FileValidationError(`O ficheiro excede o limite de 10 MB (tem ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
  }
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
    throw new FileValidationError(`Extensão não permitida (${extension}). Aceites: ${ALLOWED_FILE_EXTENSIONS.join(", ")}.`);
  }
};

export interface UploadedFile {
  /** Referência a guardar nos campos `fileReference` (string) dos DTOs do IDF, ex. "/api/files/docs/{guid}_{nome}". */
  fileReference: string;
  fileName: string;
  size: number;
}

/**
 * `POST /api/files` (multipart, campo `file`). Nunca envia base64 nem `blob:` — grava a
 * `fileReference` devolvida tal como veio. O `Content-Type` com boundary é definido pelo browser
 * (ver interceptor em `service/api.ts` que remove o omissão "application/json" para FormData).
 */
export const uploadFile = (file: File): Promise<UploadedFile> => {
  validateFileForUpload(file);
  const formData = new FormData();
  formData.append("file", file);
  return call<UploadedFile>(http.post(UPLOAD_PATH, formData));
};
