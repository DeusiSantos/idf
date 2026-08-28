import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getLog, markLogAvailable, measureLog } from "@/modules/idf/api/production";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const MeasureLogForm = ({ logId }: { logId: string }) => {
  const [length, setLength] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [volume, setVolume] = useState(0);
  const workflow = useWorkflow("Tora medida");

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-semibold">Registar medição</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Input type="number" step="0.1" placeholder="Comprimento (m)" value={length || ""} onChange={(e) => setLength(Number(e.target.value))} />
        <Input type="number" placeholder="Diâmetro (cm)" value={diameter || ""} onChange={(e) => setDiameter(Number(e.target.value))} />
        <Input type="number" step="0.01" placeholder="Volume (m3)" value={volume || ""} onChange={(e) => setVolume(Number(e.target.value))} />
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy || !length || !diameter || !volume}
        onClick={() => workflow.run(() => measureLog(logId, { length, diameter, volume, volumeUnit: "m3" }))}
      >
        Guardar medição
      </Button>
    </div>
  );
};

const LogDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Tora actualizada");

  const { data: log, isLoading } = useQuery({
    queryKey: ["idf", "logs", id],
    queryFn: () => getLog(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!log) return <p className="text-muted-foreground">Tora não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={log.logCode}
        description={`${log.volume.value} ${log.volume.unit}`}
        crumbs={[{ label: "Exploração" }, { label: "Produção", to: "/idf/production" }, { label: log.logCode }]}
        actions={<StatusBadge status={log.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="operation" id={log.exploitationOperationId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <WorkflowActions
            service={SERVICE.PRODUCTION}
            status={log.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "available",
                label: "Marcar disponível",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Measured"],
                onRun: () => workflow.run(() => markLogAvailable(log.id)),
              },
            ]}
          />
          {log.status === "Created" && <MeasureLogForm logId={log.id} />}
          <Button asChild variant="outline" size="sm">
            <Link to={`/idf/traceability/Log/${log.id}`}>Ver rastreabilidade</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medições</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Espécie</dt>
              <dd className="font-medium">
                <EntityLabel kind="species" id={log.speciesCode} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Volume</dt>
              <dd className="font-medium">
                {log.volume.value} {log.volume.unit}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Comprimento</dt>
              <dd className="font-medium">{log.length} m</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Diâmetro</dt>
              <dd className="font-medium">{log.diameter} cm</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Árvore de origem (id)</dt>
              <dd className="font-medium">{shortId(log.originTreeId)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogDetailPage;
