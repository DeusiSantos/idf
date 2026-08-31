import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { PolygonBoundaryDrawer } from "@/components/idf/PolygonBoundaryDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  activateConcession,
  approveConcession,
  beginConcessionReview,
  getConcession,
  submitConcession,
} from "@/modules/idf/api/concessions";
import { getForestArea } from "@/modules/idf/api/areas";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import { ACQUISITION_METHODS, getExtension } from "@/modules/idf/mock/concessionProcess";
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

  // Extensão mock (n.º de processo, parcela recortada da Área-mãe, tramitação em 8 fases,
  // instrumentos técnicos) — ver `modules/idf/mock/concessionProcess.ts`. Concessões anteriores a
  // esta funcionalidade não têm extensão (`getExtension` devolve `null`, nunca lança).
  const { data: extension } = useQuery({
    queryKey: ["idf", "concessions", id, "extension"],
    queryFn: () => getExtension(id),
    enabled: !!concession,
  });

  const { data: parentArea } = useQuery({
    queryKey: ["idf", "areas", extension?.parentAreaId],
    queryFn: () => getForestArea(extension!.parentAreaId),
    enabled: !!extension?.parentAreaId,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!concession) return <p className="text-muted-foreground">Concessão não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={concession.code}
        description={
          extension
            ? `${TYPE_LABELS[concession.type] ?? concession.type} · Processo ${extension.processNumber} · ${ACQUISITION_METHODS.find((m) => m.value === extension.acquisitionMethod)?.label}`
            : TYPE_LABELS[concession.type] ?? concession.type
        }
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
        <CardContent className="space-y-3">
          {/*
            Extensão de RN-09: a fonte liga esta exigência à emissão da licença anual de corte
            (PR-14); aplica-se aqui na activação da concessão como controlo preventivo antecipado
            — decisão de produto.
          */}
          {concession.status === "Approved" && extension && !extension.residentOfficerId && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Sem fiscal residente activo — a concessão não pode ser activada.
            </div>
          )}
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
              // "Aprovar" solto fica só como recurso quando não há tramitação (extensão) — com
              // extensão, é concluir a Fase H que dispara esta mesma transição automaticamente.
              ...(extension
                ? []
                : [
                    {
                      key: "approve",
                      label: "Aprovar",
                      permission: PERMISSION.APPROVE,
                      enabledFor: ["Submitted", "UnderReview"],
                      onRun: () => workflow.run(() => approveConcession(concession.id)),
                    },
                  ]),
              {
                key: "activate",
                label: "Activar",
                permission: PERMISSION.ENABLE,
                enabledFor: ["Approved"],
                guard: () => !extension || !!extension.residentOfficerId,
                guardMessage: "Sem fiscal residente activo — a concessão não pode ser activada.",
                onRun: () => workflow.run(() => activateConcession(concession.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      {extension && (
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to={`/idf/concessions/${concession.id}/tramitacao`}>
            <ListChecks className="mr-2 h-4 w-4" />
            Ver tramitação de activação (Fases A–H)
          </Link>
        </Button>
      )}

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
              <dt className="text-muted-foreground">Área (parcela)</dt>
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
          </dl>
        </CardContent>
      </Card>

      {extension && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parcela dentro da Área-mãe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {parentArea && (
              <p className="text-sm text-muted-foreground">
                Recortada de <span className="font-medium text-foreground">{parentArea.code}</span> — {parentArea.designation} (
                {((extension.parcelAreaHectares / parentArea.calculatedAreaHectares) * 100).toFixed(1)}% da área-mãe).
              </p>
            )}
            <PolygonBoundaryDrawer
              readOnly
              label="Polígono da parcela"
              value={extension.parcelBoundary}
              onChange={() => undefined}
              referenceBoundary={parentArea?.boundary}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConcessionDetailPage;
