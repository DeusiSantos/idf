import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { VolumeProgress } from "@/components/idf/VolumeProgress";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { approveQuota, beginQuotaAnalysis, getQuota } from "@/modules/idf/api/quotas";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const QuotaDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Quota actualizada");

  const { data: quota, isLoading } = useQuery({
    queryKey: ["idf", "quotas", id],
    queryFn: () => getQuota(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!quota) return <p className="text-muted-foreground">Quota não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Quota ${shortId(quota.id)}`}
        description={`${quota.consumedVolume.toLocaleString("pt-AO")} / ${quota.authorizedVolume.toLocaleString("pt-AO")} m3 consumidos`}
        crumbs={[{ label: "Planeamento" }, { label: "Quotas", to: "/idf/quotas" }, { label: shortId(quota.id) }]}
        actions={<StatusBadge status={quota.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="concession" id={quota.concessionId} />
        <RelatedEntityCard kind="inventory" id={quota.forestInventoryId} />
        <RelatedEntityCard kind="plan" id={quota.managementPlanId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorkflowActions
            service={SERVICE.QUOTAS}
            status={quota.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "analysis",
                label: "Colocar em análise",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Requested"],
                onRun: () => workflow.run(() => beginQuotaAnalysis(quota.id)),
              },
              {
                key: "approve",
                label: "Aprovar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["UnderAnalysis"],
                onRun: () => workflow.run(() => approveQuota(quota.id)),
              },
            ]}
          />
          <p className="text-xs text-muted-foreground">
            O consumo da quota é registado automaticamente a cada licença emitida (regra 9.4).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VolumeProgress consumed={quota.consumedVolume} authorized={quota.authorizedVolume} unit="m3" />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Autorizado</dt>
              <dd className="font-medium">{quota.authorizedVolume.toLocaleString("pt-AO")} m3</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Saldo</dt>
              <dd className="font-medium">{quota.remainingVolume.toLocaleString("pt-AO")} m3</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotaDetailPage;
