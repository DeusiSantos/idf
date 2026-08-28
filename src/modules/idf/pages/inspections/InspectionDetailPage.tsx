import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard, type RelatedKind } from "@/components/idf/RelatedEntityCard";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { completeInspection, getInspection, startInspection } from "@/modules/idf/api/inspections";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import type { FindingSeverity, TargetEntityType } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const TARGET_LABELS: Record<TargetEntityType, string> = {
  ForestOperator: "Operador",
  ForestLot: "Lote",
  Warehouse: "Entreposto",
  TransitGuide: "Guia de trânsito",
  ExportProcess: "Exportação",
  ForestLicense: "Licença",
};

const TARGET_KIND: Record<TargetEntityType, RelatedKind> = {
  ForestOperator: "operator",
  ForestLot: "lot",
  Warehouse: "warehouse",
  TransitGuide: "transitGuide",
  ExportProcess: "export",
  ForestLicense: "license",
};

const SEVERITY_LABELS: Record<FindingSeverity, string> = {
  Low: "Baixa",
  Medium: "Média",
  High: "Alta",
  Critical: "Crítica",
};

const InspectionDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Inspecção actualizada");

  const { data: inspection, isLoading } = useQuery({
    queryKey: ["idf", "inspections", id],
    queryFn: () => getInspection(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!inspection) return <p className="text-muted-foreground">Inspecção não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={inspection.inspectionNumber ?? shortId(inspection.id)}
        description={`Alvo: ${TARGET_LABELS[inspection.targetEntityType]}`}
        crumbs={[
          { label: "Controlo" },
          { label: "Inspecções", to: "/idf/inspections" },
          { label: inspection.inspectionNumber ?? shortId(inspection.id) },
        ]}
        actions={<StatusBadge status={inspection.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind={TARGET_KIND[inspection.targetEntityType]} id={inspection.targetEntityId} />
        <RelatedEntityCard kind="revenue" id={inspection.revenueTransactionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.INSPECTIONS}
            status={inspection.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "start",
                label: "Iniciar no terreno",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Scheduled"],
                onRun: () => workflow.run(() => startInspection(inspection.id)),
              },
              {
                key: "complete",
                label: "Concluir inspecção",
                permission: PERMISSION.UPDATE,
                enabledFor: ["InProgress"],
                onRun: () => workflow.run(() => completeInspection(inspection.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados da inspecção</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Data agendada</dt>
              <dd className="font-medium">{formatDate(inspection.scheduledDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Coordenadas</dt>
              <dd className="font-medium">
                {inspection.location.latitude}, {inspection.location.longitude}
              </dd>
            </div>
            {inspection.billableAmount != null && (
              <div>
                <dt className="text-muted-foreground">Valor facturável</dt>
                <dd className="font-medium">
                  {inspection.billableAmount.toLocaleString("pt-AO")} {inspection.billableCurrency}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Constatações ({inspection.findings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {inspection.findings.length === 0 ? (
            <p className="text-muted-foreground">Sem constatações registadas.</p>
          ) : (
            inspection.findings.map((finding) => (
              <div key={finding.id} className="space-y-1 rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{finding.description}</span>
                  <Badge variant="outline">{SEVERITY_LABELS[finding.severity]}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <PaymentPanel revenueTransactionId={inspection.revenueTransactionId ?? undefined} />
    </div>
  );
};

export default InspectionDetailPage;
