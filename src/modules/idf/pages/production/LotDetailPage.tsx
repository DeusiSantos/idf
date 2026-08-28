import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { closeLot, getLot } from "@/modules/idf/api/production";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const LotDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Lote actualizado");

  const { data: lot, isLoading } = useQuery({
    queryKey: ["idf", "lots", id],
    queryFn: () => getLot(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!lot) return <p className="text-muted-foreground">Lote não encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={lot.lotCode}
        description={`${lot.items.length} tora(s) associada(s)`}
        crumbs={[{ label: "Exploração" }, { label: "Produção", to: "/idf/production" }, { label: lot.lotCode }]}
        actions={<StatusBadge status={lot.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        {lot.items.map((item) => (
          <RelatedEntityCard key={item.logId} kind="log" id={item.logId} />
        ))}
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <WorkflowActions
            service={SERVICE.PRODUCTION}
            status={lot.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "close",
                label: "Fechar lote",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Open"],
                onRun: () => workflow.run(() => closeLot(lot.id)),
              },
            ]}
          />
          <Button asChild variant="outline" size="sm">
            <Link to={`/idf/traceability/ForestLot/${lot.id}`}>Ver rastreabilidade</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toras no lote ({lot.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {lot.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ainda sem toras associadas.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {lot.items.map((item) => (
                <li key={item.logId}>
                  <Link
                    to={`/idf/production/logs/${item.logId}`}
                    className="rounded-md border px-2 py-1 text-sm hover:border-primary hover:text-primary"
                  >
                    {shortId(item.logId)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LotDetailPage;
