import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  activateConcession,
  approveConcession,
  beginConcessionReview,
  getConcession,
  submitConcession,
} from "@/modules/idf/api/concessions";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import type { ConcessionDto } from "@/modules/idf/types";

const TYPE_LABELS: Record<ConcessionDto["type"], string> = {
  ForestConcession: "Concessão florestal",
  CommunityForest: "Floresta comunitária",
  Other: "Outro",
};

const ConcessionDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Concessão actualizada");

  const { data: concession, isLoading } = useQuery({
    queryKey: ["idf", "concessions", id],
    queryFn: () => getConcession(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!concession) return <p className="text-muted-foreground">Concessão não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={concession.code}
        description={TYPE_LABELS[concession.type] ?? concession.type}
        crumbs={[{ label: "Cadastro" }, { label: "Concessões", to: "/idf/concessions" }, { label: concession.code }]}
        actions={<StatusBadge status={concession.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="operator" id={concession.forestOperatorId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.CONCESSIONS}
            status={concession.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "submit",
                label: "Submeter",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Draft"],
                onRun: () => workflow.run(() => submitConcession(concession.id)),
              },
              {
                key: "review",
                label: "Colocar em análise",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Submitted"],
                onRun: () => workflow.run(() => beginConcessionReview(concession.id)),
              },
              {
                key: "approve",
                label: "Aprovar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["Submitted", "UnderReview"],
                onRun: () => workflow.run(() => approveConcession(concession.id)),
              },
              {
                key: "activate",
                label: "Activar",
                permission: PERMISSION.ENABLE,
                enabledFor: ["Approved"],
                onRun: () => workflow.run(() => activateConcession(concession.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados da concessão</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="font-medium">{TYPE_LABELS[concession.type] ?? concession.type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Área</dt>
              <dd className="font-medium">{concession.areaHectares.toLocaleString("pt-AO")} ha</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(concession.validityPeriod.startDate)} → {formatDate(concession.validityPeriod.endDate)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Localização administrativa</dt>
              <dd className="font-medium">
                {concession.location
                  ? [concession.location.commune, concession.location.municipality, concession.location.province]
                      .filter(Boolean)
                      .join(", ")
                  : "Não definida"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Área geográfica (polígono)</dt>
              {concession.boundary ? (
                <dd className="mt-1 grid grid-cols-2 gap-1 text-xs sm:grid-cols-4">
                  {(["point1", "point2", "point3", "point4"] as const).map((key, index) => (
                    <span key={key} className="font-medium text-foreground">
                      V{index + 1}: {concession.boundary![key].latitude}, {concession.boundary![key].longitude}
                    </span>
                  ))}
                </dd>
              ) : (
                <dd className="font-medium">Não definida</dd>
              )}
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConcessionDetailPage;
