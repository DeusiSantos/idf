import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface QueryErrorProps {
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
}

export function QueryError({ error, onRetry, message }: QueryErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Erro ao carregar dados
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {message || 'Ocorreu um erro ao carregar os dados. Verifique a sua ligação e tente novamente.'}
        </p>
        {error?.message && (
          <p className="text-xs text-muted-foreground/70 mb-4 font-mono max-w-md truncate">
            {error.message}
          </p>
        )}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface QueryEmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function QueryEmpty({ icon, title, description, action }: QueryEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon || <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />}
      <h3 className="text-lg font-semibold text-muted-foreground mb-1">
        {title || 'Sem dados'}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground/70 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function QueryTableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
