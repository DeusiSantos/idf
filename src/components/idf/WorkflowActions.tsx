import { Button } from "@/components/ui/button";
import { usePermissions } from "@/modules/idf/hooks/usePermission";
import type { PermissionCode, ServiceCode } from "@/modules/idf/config/modules";

export interface WorkflowAction {
  key: string;
  label: string;
  permission: PermissionCode;
  variant?: "default" | "outline" | "destructive" | "secondary";
  /** Estados em que a acção é válida. */
  enabledFor: string[];
  onRun: () => void | Promise<void>;
}

interface WorkflowActionsProps {
  service: ServiceCode;
  status: string;
  actions: WorkflowAction[];
  isBusy?: boolean;
}

/** Mostra apenas acções válidas para o estado actual e permitidas ao utilizador. */
export const WorkflowActions = ({ service, status, actions, isBusy }: WorkflowActionsProps) => {
  const { has } = usePermissions();
  const available = actions.filter((a) => a.enabledFor.includes(status) && has(service, a.permission));

  if (!available.length) {
    return <p className="text-sm text-muted-foreground">Sem acções disponíveis neste estado.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((action) => (
        <Button
          key={action.key}
          variant={action.variant ?? "default"}
          size="sm"
          disabled={isBusy}
          onClick={() => action.onRun()}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default WorkflowActions;
