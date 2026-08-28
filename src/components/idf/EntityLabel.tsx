import { useQuery } from "@tanstack/react-query";
import { listForestSpecies } from "@/modules/idf/api/admin";
import { getOperator } from "@/modules/idf/api/operators";
import { getConcession } from "@/modules/idf/api/concessions";
import { getInventory } from "@/modules/idf/api/inventories";
import { getManagementPlan } from "@/modules/idf/api/managementPlans";
import { getQuota } from "@/modules/idf/api/quotas";
import { getLicense } from "@/modules/idf/api/licenses";
import { getExploitationOperation } from "@/modules/idf/api/exploitation";
import { getLot, getLog } from "@/modules/idf/api/production";
import { getInspection } from "@/modules/idf/api/inspections";
import { getTransitGuide } from "@/modules/idf/api/transitGuides";
import { getWarehouse } from "@/modules/idf/api/warehouses";
import { getCertificate } from "@/modules/idf/api/certificates";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

/**
 * Resolve o rótulo legível de uma entidade a partir do id, via API (a UI nunca deve assumir
 * uma cache local — secção 7). Substitui o `labelFor` síncrono do mock por leituras reais,
 * com cache do react-query por id para não repetir pedidos na mesma tabela.
 */
const RESOLVERS = {
  operator: (id: string) => getOperator(id).then((o) => o.legalName),
  concession: (id: string) => getConcession(id).then((c) => c.code),
  inventory: (id: string) => getInventory(id).then((i) => `Inventário ${shortId(i.id)}`),
  plan: (id: string) => getManagementPlan(id).then((p) => `Plano ${shortId(p.id)}`),
  quota: (id: string) => getQuota(id).then((q) => `Quota ${shortId(q.id)}`),
  license: (id: string) => getLicense(id).then((l) => l.licenseNumber ?? `Licença ${shortId(l.id)}`),
  operation: (id: string) => getExploitationOperation(id).then((o) => `Operação ${shortId(o.id)}`),
  lot: (id: string) => getLot(id).then((l) => l.lotCode),
  log: (id: string) => getLog(id).then((l) => l.logCode),
  inspection: (id: string) => getInspection(id).then((i) => i.inspectionNumber ?? `Inspecção ${shortId(i.id)}`),
  transitGuide: (id: string) => getTransitGuide(id).then((g) => g.guideNumber ?? `Guia ${shortId(g.id)}`),
  warehouse: (id: string) => getWarehouse(id).then((w) => w.name || w.code),
  certificate: (id: string) =>
    getCertificate(id).then((c) => c.certificateNumber ?? `Certificado ${shortId(c.id)}`),
  /** O campo "speciesCode" das árvores/toras é o código da espécie (nunca o id) — não há GET por id. */
  species: (code: string) =>
    listForestSpecies({ code, pageSize: 1 }).then((r) => r.items[0]?.commonName ?? code),
} as const;

export type EntityLabelKind = keyof typeof RESOLVERS;

interface EntityLabelProps {
  kind: EntityLabelKind;
  id: string | null | undefined;
}

/** Uso em JSX: `<EntityLabel kind="operator" id={item.forestOperatorId} />`. */
export const EntityLabel = ({ kind, id }: EntityLabelProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["idf", "label", kind, id],
    queryFn: () => RESOLVERS[kind](id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (!id) return <>—</>;
  if (isLoading) return <>…</>;
  return <>{data ?? "—"}</>;
};

export default EntityLabel;
