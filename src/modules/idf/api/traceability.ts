import { call, http } from "@/modules/idf/api/http";
import { TRACEABILITY_ENTITY_TYPE, toEnumName } from "@/modules/idf/types/enums";
import type { TraceabilityChainDto, TraceabilityEntityType } from "@/modules/idf/types";

interface RawChain extends Omit<TraceabilityChainDto, "entryPoint"> {
  entryPoint: number;
}

const mapChain = (raw: RawChain): TraceabilityChainDto => ({
  ...raw,
  entryPoint: toEnumName(TRACEABILITY_ENTITY_TYPE, raw.entryPoint),
});

/**
 * `entityType` vai na URL como o nome do enum (ex.: "Log", "ForestLot", "ExportProcess") —
 * o binding de rota do ASP.NET aceita o nome directamente, ao contrário do corpo JSON.
 */
export const getTraceabilityChain = (
  entityType: TraceabilityEntityType,
  id: string,
): Promise<TraceabilityChainDto> => call<RawChain>(http.get(`idf/traceability/${entityType}/${id}`)).then(mapChain);
