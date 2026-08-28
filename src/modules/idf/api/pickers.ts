import type { PickerOption } from "@/components/idf/EntityPicker";
import { listOperators } from "@/modules/idf/api/operators";
import { listConcessions } from "@/modules/idf/api/concessions";
import { listInventories } from "@/modules/idf/api/inventories";
import { listManagementPlans } from "@/modules/idf/api/managementPlans";
import { listQuotas } from "@/modules/idf/api/quotas";
import { listLicenses } from "@/modules/idf/api/licenses";
import { listExploitationOperations } from "@/modules/idf/api/exploitation";
import { listLots } from "@/modules/idf/api/production";
import { listForestSpecies, listRoles } from "@/modules/idf/api/admin";
import { listInspections } from "@/modules/idf/api/inspections";
import { listWarehouses } from "@/modules/idf/api/warehouses";
import { listTransitGuides } from "@/modules/idf/api/transitGuides";
import { listExportProcesses } from "@/modules/idf/api/exports";

/** Selectores async entre módulos (secção 7) — sempre lidos da API, nunca de cache local. */

/** Sufixo curto e legível para entidades reais que não têm um código de negócio próprio. */
const shortId = (id: string) => `#${id.slice(0, 8)}`;
const dateOnly = (iso: string) => iso.slice(0, 10);

export const loadActiveOperators = async (): Promise<PickerOption[]> => {
  const { items } = await listOperators({ status: "Active", pageSize: 200 });
  return items.map((o) => ({ value: o.id, label: o.legalName, hint: o.taxIdentificationNumber }));
};

export const loadOperators = async (): Promise<PickerOption[]> => {
  const { items } = await listOperators({ pageSize: 200 });
  return items.map((o) => ({ value: o.id, label: o.legalName, hint: o.taxIdentificationNumber }));
};

export const loadActiveConcessions = async (): Promise<PickerOption[]> => {
  const { items } = await listConcessions({ status: "Active", pageSize: 200 });
  return items.map((c) => ({ value: c.id, label: c.code, hint: `${c.areaHectares} ha` }));
};

export const loadValidatedInventories = async (concessionId?: string): Promise<PickerOption[]> => {
  const { items } = await listInventories({ status: "Validated", concessionId, pageSize: 200 });
  return items.map((i) => ({
    value: i.id,
    label: `Inventário ${shortId(i.id)}`,
    hint: `${i.trees.length} árvore(s) · até ${dateOnly(i.validityPeriod.endDate)}`,
  }));
};

export const loadApprovedPlans = async (concessionId?: string): Promise<PickerOption[]> => {
  const { items } = await listManagementPlans({ status: "Approved", concessionId, pageSize: 200 });
  return items.map((p) => ({
    value: p.id,
    label: `Plano ${shortId(p.id)}`,
    hint: `${p.cuttingSelections.reduce((sum, s) => sum + s.trees.length, 0)} árvore(s) seleccionada(s)`,
  }));
};

export const loadApprovedQuotas = async (concessionId?: string): Promise<PickerOption[]> => {
  const { items } = await listQuotas({ status: "Approved", concessionId, pageSize: 200 });
  return items.map((q) => ({
    value: q.id,
    label: `Quota ${shortId(q.id)}`,
    hint: `saldo ${q.remainingVolume.toFixed(0)} m³`,
  }));
};

export const loadActiveLicenses = async (): Promise<PickerOption[]> => {
  const { items } = await listLicenses({ status: "Active", pageSize: 200 });
  return items.map((l) => ({
    value: l.id,
    label: l.licenseNumber ?? `Licença ${shortId(l.id)}`,
    hint: `${l.authorizedVolume.value} ${l.authorizedVolume.unit}`,
  }));
};

export const loadOpenOperations = async (): Promise<PickerOption[]> => {
  const { items } = await listExploitationOperations({ pageSize: 200 });
  return items
    .filter((o) => o.status === "Started" || o.status === "InProgress")
    .map((o) => ({ value: o.id, label: `Operação ${shortId(o.id)}`, hint: dateOnly(o.startedAt) }));
};

/** Todas as operações (não só as activas) — usado para localizar toras já disponíveis de operações já concluídas. */
export const loadOperations = async (): Promise<PickerOption[]> => {
  const { items } = await listExploitationOperations({ pageSize: 200 });
  return items.map((o) => ({ value: o.id, label: `Operação ${shortId(o.id)}`, hint: `${o.status} · ${dateOnly(o.startedAt)}` }));
};

/**
 * ⚠️ A API não expõe uma listagem de toras (só `GET /idf/logs/{id}` por id) — sem endpoint de
 * lista não há como popular este selector a partir do backend. Devolve sempre vazio até o
 * backend disponibilizar `GET /idf/logs`.
 */
export const loadAvailableLogs = async (): Promise<PickerOption[]> => {
  console.warn("loadAvailableLogs: a API não tem GET /idf/logs (listagem) — selector fica vazio.");
  return [];
};

export const loadClosedLots = async (): Promise<PickerOption[]> => {
  const { items } = await listLots({ status: "Closed", pageSize: 200 });
  return items.map((l) => ({ value: l.id, label: l.lotCode, hint: `${l.items.length} tora(s)` }));
};

export const loadSpecies = async (): Promise<PickerOption[]> => {
  const { items } = await listForestSpecies({ pageSize: 500 });
  return items.map((s) => ({ value: s.code, label: s.commonName, hint: s.scientificName }));
};

export const loadWarehouses = async (): Promise<PickerOption[]> => {
  const { items } = await listWarehouses({ pageSize: 200 });
  return items.map((w) => ({ value: w.id, label: w.name, hint: w.code }));
};

export const loadTransitGuides = async (): Promise<PickerOption[]> => {
  const { items } = await listTransitGuides({ pageSize: 200 });
  return items.map((g) => ({ value: g.id, label: g.guideNumber ?? shortId(g.id), hint: g.status }));
};

export const loadExportProcesses = async (): Promise<PickerOption[]> => {
  const { items } = await listExportProcesses({ pageSize: 200 });
  return items.map((e) => ({ value: e.id, label: shortId(e.id), hint: e.destinationCountry }));
};

export const loadRoles = async (): Promise<PickerOption[]> => {
  const { items } = await listRoles({ isActive: true, pageSize: 200 });
  return items.map((r) => ({ value: r.id, label: r.name ?? shortId(r.id), hint: r.code ?? undefined }));
};

export const loadCompletedInspections = async (): Promise<PickerOption[]> => {
  const { items } = await listInspections({ status: "Completed", pageSize: 200 });
  return items.map((i) => ({
    value: i.id,
    label: i.inspectionNumber ?? `Inspecção ${shortId(i.id)}`,
    hint: dateOnly(i.scheduledDate),
  }));
};
