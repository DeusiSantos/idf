import { createMockStore, newMockId } from "@/modules/idf/mock/store";
import type { PagedResult } from "@/modules/idf/types";

/**
 * Preços por espécie (AOA/m³) usados no Licenciamento — Exploração Florestal — para estimar a
 * taxa a liquidar por linha. Definidos pelo administrador em `/idf/admin`. Mock local, sem
 * endpoint no backend (a SIGAFLO/DRF-02 não define uma tabela de preços) — decisão de produto
 * pedida pelo utilizador.
 */

export interface SpeciesPriceDto {
  id: string;
  speciesCode: string;
  pricePerM3: number;
  currency: string;
  updatedAt: string;
}

const store = createMockStore<SpeciesPriceDto>("idf.mock.speciesPrices");

export const listSpeciesPrices = (): Promise<PagedResult<SpeciesPriceDto>> => store.list({ pageSize: 1000 });

/** Leitura síncrona local — usada para mostrar o preço ao vivo enquanto se preenche uma linha de espécie. */
export const getSpeciesPriceByCode = (speciesCode: string): SpeciesPriceDto | null =>
  store.all().find((p) => p.speciesCode === speciesCode) ?? null;

/** Cria ou actualiza o preço da espécie — uma entrada por `speciesCode`. */
export const upsertSpeciesPrice = async (speciesCode: string, pricePerM3: number, currency = "AOA"): Promise<SpeciesPriceDto> => {
  const existing = getSpeciesPriceByCode(speciesCode);
  const updatedAt = new Date().toISOString();
  if (existing) return store.update(existing.id, { pricePerM3, currency, updatedAt });
  return store.create({ id: newMockId(), speciesCode, pricePerM3, currency, updatedAt });
};
