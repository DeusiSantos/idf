import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { ConcessionPhaseTimeline } from "@/components/idf/ConcessionPhaseTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { approveConcession, getConcession } from "@/modules/idf/api/concessions";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { getExtension } from "@/modules/idf/mock/concessionProcess";

/**
 * Ecrã dedicado só à tramitação de activação (Fases A–H) — separado do processo completo
 * (`ConcessionDetailPage`) a pedido do utilizador, para não misturar o fluxo geral (submeter,
 * aprovar, activar) com o detalhe fase a fase.
 */
const ConcessionTramitationPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Concessão actualizada");
  const queryClient = useQueryClient();

  const { data: concession, isLoading } = useQuery({
    queryKey: ["idf", "concessions", id],
    queryFn: () => getConcession(id),
  });

  const { data: extension, isLoading: isLoadingExtension } = useQuery({
    queryKey: ["idf", "concessions", id, "extension"],
    queryFn: () => getExtension(id),
    enabled: !!concession,
  });

  const refreshExtension = () => queryClient.invalidateQueries({ queryKey: ["idf", "concessions", id, "extension"] });

  if (isLoading || isLoadingExtension) return <Skeleton className="h-64 w-full" />;
  if (!concession) return <p className="text-muted-foreground">Concessão não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tramitação de activação"
        description={`Fases A–H — ${concession.code}`}
        crumbs={[
          { label: "Cadastro" },
          { label: "Concessões", to: "/idf/concessions" },
          { label: concession.code, to: `/idf/concessions/${concession.id}` },
          { label: "Tramitação" },
        ]}
        actions={<StatusBadge status={concession.status} className="px-3 py-1 text-sm" />}
      />

      {extension ? (
        <Card>
          <CardContent className="pt-6">
            <ConcessionPhaseTimeline
              extension={extension}
              refresh={refreshExtension}
              onPhaseHCompleted={() => workflow.run(() => approveConcession(concession.id))}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">Esta concessão não tem tramitação registada.</p>
      )}
    </div>
  );
};

export default ConcessionTramitationPage;
