import { ChangeEvent, useRef, useState } from "react";
import { Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ALLOWED_FILE_ACCEPT, FileValidationError, uploadFile } from "@/modules/idf/api/files";
import { getApiErrorMessage } from "@/lib/apiError";

interface FileUploadFieldProps {
  id: string;
  label: string;
  /** Referência devolvida pelo backend (o que os DTOs guardam em `fileReference`). */
  value: string | null;
  onChange: (value: string | null) => void;
  accept?: string;
  error?: string;
}

/**
 * Regra 9.8: qualquer documento/foto/comprovativo é sempre upload de ficheiro, nunca um campo
 * de texto ou link. Envia o ficheiro para a API (ver `modules/idf/api/files.ts`) e guarda a
 * referência devolvida — não guarda o ficheiro localmente.
 */
export const FileUploadField = ({
  id,
  label,
  value,
  onChange,
  accept = ALLOWED_FILE_ACCEPT,
  error,
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded.fileReference);
    } catch (err) {
      if (err instanceof FileValidationError) setUploadError(err.message);
      else setUploadError(getApiErrorMessage(err, "Não foi possível carregar o ficheiro."));
    } finally {
      setIsUploading(false);
    }
  };

  const fileName = value ? decodeURIComponent(value.split("/").pop() ?? value) : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <input id={id} ref={inputRef} type="file" accept={accept} className="sr-only" onChange={handleChange} />
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{fileName}</span>
          </span>
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(null)} aria-label="Remover ficheiro">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
          {isUploading ? "A carregar…" : "Carregar ficheiro"}
        </Button>
      )}
      {(error || uploadError) && <p className="text-sm text-destructive">{error ?? uploadError}</p>}
    </div>
  );
};

export default FileUploadField;
