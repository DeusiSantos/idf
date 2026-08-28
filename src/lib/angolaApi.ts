// Cliente para a API Províncias de Angola — https://angolaprovinciasapi.ggwp.com.br/docs
// Usada para preencher em cascata Província → Município → Comuna no formulário de concessões.
// Nota: a API ignora query params de filtro; só as rotas aninhadas (/provincias/{slug}/municipios,
// /municipios/{slug}/comunas) retornam listas filtradas. Não existe rota para "Aldeia".

const ANGOLA_API_BASE = "https://angolaprovinciasapi.ggwp.com.br/api/v1";

export interface AngolaLocation {
  nome: string;
  slug: string;
}

interface AngolaApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export async function fetchProvincias(): Promise<AngolaLocation[]> {
  const res = await fetch(`${ANGOLA_API_BASE}/provincias`);
  if (!res.ok) throw new Error("Falha ao carregar províncias");
  const json: AngolaApiResponse<AngolaLocation[]> = await res.json();
  return json.data ?? [];
}

export async function fetchMunicipiosPorProvincia(provinciaSlug: string): Promise<AngolaLocation[]> {
  const res = await fetch(`${ANGOLA_API_BASE}/provincias/${provinciaSlug}/municipios`);
  if (!res.ok) throw new Error("Falha ao carregar municípios");
  const json: AngolaApiResponse<AngolaLocation[]> = await res.json();
  return json.data ?? [];
}

export async function fetchComunasPorMunicipio(municipioSlug: string): Promise<AngolaLocation[]> {
  const res = await fetch(`${ANGOLA_API_BASE}/municipios/${municipioSlug}/comunas`);
  if (!res.ok) throw new Error("Falha ao carregar comunas");
  const json: AngolaApiResponse<AngolaLocation[]> = await res.json();
  return json.data ?? [];
}
