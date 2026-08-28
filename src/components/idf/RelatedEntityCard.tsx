import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { listForestSpecies } from "@/modules/idf/api/admin";
import { getOperator } from "@/modules/idf/api/operators";
import { getConcession } from "@/modules/idf/api/concessions";
import { getInventory } from "@/modules/idf/api/inventories";
import { getManagementPlan } from "@/modules/idf/api/managementPlans";
import { getQuota } from "@/modules/idf/api/quotas";
import { getLicense } from "@/modules/idf/api/licenses";
import { getExploitationOperation } from "@/modules/idf/api/exploitation";
import { getLot, getLog } from "@/modules/idf/api/production";
import { getTransitGuide } from "@/modules/idf/api/transitGuides";
import { getWarehouse } from "@/modules/idf/api/warehouses";
import { getCertificate } from "@/modules/idf/api/certificates";
import { getExportProcess } from "@/modules/idf/api/exports";
import { getInspection } from "@/modules/idf/api/inspections";
import { getEnforcementCase } from "@/modules/idf/api/enforcement";
import { getRevenueTransaction } from "@/modules/idf/api/revenue";

const shortId = (id: string) => `#${id.slice(0, 8)}`;
const km = (v: number, u = "m3") => `${v.toLocaleString("pt-AO")} ${u}`;

interface SummaryRow {
  label: string;
  value: string;
  wide?: boolean;
}

interface RelatedConfig<T> {
  title: string;
  route: (id: string) => string;
  load: (id: string) => Promise<T>;
  status?: (data: T) => string;
  summary: (data: T) => SummaryRow[];
}

function related<T>(config: RelatedConfig<T>): RelatedConfig<T> {
  return config;
}

/** Registo central: por cada tipo de entidade, como buscar o registo completo (não só o nome) e o que mostrar. */
export const RELATED_REGISTRY = {
  operator: related({
    title: "Operador",
    route: (id) => `/idf/operators/${id}`,
    load: getOperator,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Denominação legal", value: d.legalName, wide: true },
      { label: "NIF", value: d.taxIdentificationNumber },
      { label: "Nº operador", value: d.operatorNumber ?? "—" },
      { label: "Contactos", value: `${d.contacts.length} registado(s)` },
    ],
  }),
  concession: related({
    title: "Concessão",
    route: (id) => `/idf/concessions/${id}`,
    load: getConcession,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Código", value: d.code },
      { label: "Tipo", value: d.type },
      { label: "Área", value: `${d.areaHectares.toLocaleString("pt-AO")} ha` },
      { label: "Localização", value: d.location ? `${d.location.municipality}, ${d.location.province}` : "—" },
      { label: "Validade", value: `${d.validityPeriod.startDate.slice(0, 10)} → ${d.validityPeriod.endDate.slice(0, 10)}`, wide: true },
    ],
  }),
  inventory: related({
    title: "Inventário Florestal",
    route: (id) => `/idf/inventories/${id}`,
    load: getInventory,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Árvores inventariadas", value: `${d.trees.length}` },
      { label: "Validade", value: `${d.validityPeriod.startDate.slice(0, 10)} → ${d.validityPeriod.endDate.slice(0, 10)}`, wide: true },
    ],
  }),
  plan: related({
    title: "Plano de Maneio",
    route: (id) => `/idf/management-plans/${id}`,
    load: getManagementPlan,
    status: (d) => d.status,
    summary: (d) => [
      {
        label: "Árvores seleccionadas",
        value: `${d.cuttingSelections.reduce((sum, s) => sum + s.trees.length, 0)}`,
      },
      { label: "Validade", value: `${d.validityPeriod.startDate.slice(0, 10)} → ${d.validityPeriod.endDate.slice(0, 10)}`, wide: true },
    ],
  }),
  quota: related({
    title: "Quota",
    route: (id) => `/idf/quotas/${id}`,
    load: getQuota,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Autorizado", value: km(d.authorizedVolume) },
      { label: "Consumido", value: km(d.consumedVolume) },
      { label: "Saldo", value: km(d.remainingVolume), wide: true },
    ],
  }),
  license: related({
    title: "Licença",
    route: (id) => `/idf/licenses/${id}`,
    load: getLicense,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nº licença", value: d.licenseNumber ?? shortId(d.id), wide: true },
      { label: "Volume autorizado", value: km(d.authorizedVolume.value, d.authorizedVolume.unit) },
      { label: "Validade", value: `${d.validityPeriod.startDate.slice(0, 10)} → ${d.validityPeriod.endDate.slice(0, 10)}`, wide: true },
    ],
  }),
  operation: related({
    title: "Operação de Exploração",
    route: (id) => `/idf/exploitation/${id}`,
    load: getExploitationOperation,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Início", value: d.startedAt?.slice(0, 10) ?? "—" },
      { label: "Árvores abatidas", value: `${d.harvestedTrees.length}` },
    ],
  }),
  lot: related({
    title: "Lote",
    route: (id) => `/idf/production/lots/${id}`,
    load: getLot,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Código", value: d.lotCode },
      { label: "Toras", value: `${d.items.length}` },
    ],
  }),
  log: related({
    title: "Tora",
    route: (id) => `/idf/production/logs/${id}`,
    // `speciesCode` é o código da espécie (não há GET por id) — resolve o nome junto com a tora.
    load: async (id) => {
      const log = await getLog(id);
      const species = await listForestSpecies({ code: log.speciesCode, pageSize: 1 }).catch(() => null);
      return { ...log, speciesName: species?.items[0]?.commonName ?? log.speciesCode };
    },
    status: (d) => d.status,
    summary: (d) => [
      { label: "Código", value: d.logCode },
      { label: "Espécie", value: d.speciesName },
      { label: "Volume", value: km(d.volume.value, d.volume.unit) },
    ],
  }),
  transitGuide: related({
    title: "Guia de Trânsito",
    route: (id) => `/idf/transit-guides/${id}`,
    load: getTransitGuide,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nº guia", value: d.guideNumber ?? shortId(d.id) },
      { label: "Trajecto", value: `${d.origin} → ${d.destination}`, wide: true },
    ],
  }),
  warehouse: related({
    title: "Entreposto",
    route: (id) => `/idf/warehouses/${id}`,
    load: getWarehouse,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nome", value: d.name, wide: true },
      { label: "Código", value: d.code },
      { label: "Stock", value: km(d.stocks.reduce((s, x) => s + x.volume, 0)) },
    ],
  }),
  certificate: related({
    title: "Certificado",
    route: (id) => `/idf/certificates/${id}`,
    load: getCertificate,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nº certificado", value: d.certificateNumber ?? shortId(d.id) },
      { label: "Tipo", value: d.certificateType },
    ],
  }),
  export: related({
    title: "Processo de Exportação",
    route: (id) => `/idf/exports/${id}`,
    load: getExportProcess,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Destino", value: `${d.destinationCountry} · ${d.destinationPort}`, wide: true },
    ],
  }),
  inspection: related({
    title: "Inspecção",
    route: (id) => `/idf/inspections/${id}`,
    load: getInspection,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nº inspecção", value: d.inspectionNumber ?? shortId(d.id) },
      { label: "Data agendada", value: d.scheduledDate.slice(0, 10) },
      { label: "Constatações", value: `${d.findings.length}` },
    ],
  }),
  enforcement: related({
    title: "Processo de Fiscalização",
    route: (id) => `/idf/enforcement/${id}`,
    load: getEnforcementCase,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Nº processo", value: d.caseNumber ?? shortId(d.id) },
      { label: "Violações", value: `${d.violations.length}` },
      { label: "Multas", value: `${d.fines.length}` },
    ],
  }),
  revenue: related({
    title: "Transacção de Receita",
    route: (id) => `/idf/revenue/${id}`,
    load: getRevenueTransaction,
    status: (d) => d.status,
    summary: (d) => [
      { label: "Tipo de acto", value: d.actType },
      { label: "Valor", value: `${d.amount.toLocaleString("pt-AO")} ${d.currency}`, wide: true },
    ],
  }),
} as const;

export type RelatedKind = keyof typeof RELATED_REGISTRY;

interface RelatedEntityCardProps {
  kind: RelatedKind;
  id: string | null | undefined;
}

/** Cartão de relação — busca a entidade relacionada completa (não só o nome) e liga ao seu processo. */
export const RelatedEntityCard = ({ kind, id }: RelatedEntityCardProps) => {
  const config = RELATED_REGISTRY[kind] as RelatedConfig<unknown>;
  const { data, isLoading } = useQuery({
    queryKey: ["idf", "related", kind, id],
    queryFn: () => config.load(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });

  if (!id) return null;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{config.title}</p>
          {!isLoading && data && config.status && <StatusBadge status={config.status(data)} />}
        </div>
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : !data ? (
          <p className="text-sm text-muted-foreground">Não encontrado.</p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {config.summary(data).map((row) => (
                <div key={row.label} className={row.wide ? "col-span-2" : undefined}>
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="truncate font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              to={config.route(id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Ver processo completo
              <ArrowRight className="h-3 w-3" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedEntityCard;
