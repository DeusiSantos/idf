import { AlertCircle } from 'lucide-react';
import { useFormContext, type FieldErrors } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function flatten(errors: FieldErrors, prefix = ''): Array<{ name: string; message: string }> {
  const out: Array<{ name: string; message: string }> = [];
  for (const key of Object.keys(errors)) {
    const err: any = (errors as any)[key];
    if (!err) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof err?.message === 'string') {
      out.push({ name: path, message: err.message });
    } else if (typeof err === 'object') {
      out.push(...flatten(err, path));
    }
  }
  return out;
}

export function FormErrorSummary({ labels = {}, title = 'Corrija os campos destacados' }: { labels?: Record<string, string>; title?: string }) {
  const { formState } = useFormContext();
  const items = flatten(formState.errors);
  if (items.length === 0) return null;

  const focus = (name: string) => {
    const el = document.querySelector<HTMLElement>(`[name="${name}"]`) ?? document.getElementById(name);
    if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  };

  return (
    <Alert variant="destructive" role="alert" aria-live="assertive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 list-disc pl-5 space-y-0.5 text-sm">
          {items.map((it) => (
            <li key={it.name}>
              <button type="button" className="underline underline-offset-2 hover:opacity-80 text-left" onClick={() => focus(it.name)}>
                {labels[it.name] ?? it.name}
              </button>
              : {it.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}