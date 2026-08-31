import { ApiError, type PagedResult } from "@/modules/idf/types";

/**
 * Store mock genérico, com a mesma forma que um módulo `api/*.ts` real — devolve `Promise`,
 * `PagedResult`, e lança `ApiError`/`ProblemDetails` nos mesmos moldes — para que
 * `ResourceWorkspace`, `EntityPicker`, `WorkflowActions`, `useWorkflow` e `useProblem` funcionem
 * sem nenhuma alteração sobre dados mock.
 *
 * Persiste em `localStorage` (mesmo padrão do `CONCESSION_KEY` em `IdfContext.tsx`) — dados de
 * protótipo/demonstração, nunca substituem o backend real.
 */

const DELAY_MS = 250;

const delay = <T>(value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));

function loadAll<T>(key: string, seed: T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : seed;
  } catch {
    return seed;
  }
}

function saveAll<T>(key: string, items: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // localStorage indisponível (modo privado, quota excedida) — estado fica só em memória nesta sessão
  }
}

export interface MockListQuery<T> {
  page?: number;
  pageSize?: number;
  filter?: (item: T) => boolean;
}

export interface MockStore<T extends { id: string }> {
  list: (query?: MockListQuery<T>) => Promise<PagedResult<T>>;
  get: (id: string) => Promise<T>;
  create: (item: T) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T>;
  /** Leitura síncrona local — só para geradores de código (contagem por ano/província), nunca para popular UI. */
  all: () => T[];
}

export function createMockStore<T extends { id: string }>(storageKey: string, seed: T[] = []): MockStore<T> {
  let items = loadAll<T>(storageKey, seed);
  const persist = () => saveAll(storageKey, items);

  return {
    all: () => items,
    list: ({ page = 1, pageSize = 10, filter } = {}) => {
      const filtered = filter ? items.filter(filter) : items;
      const start = (page - 1) * pageSize;
      const totalCount = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      return delay({
        items: filtered.slice(start, start + pageSize),
        page,
        pageSize,
        totalCount,
        totalActive: null,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      });
    },
    get: (id: string) => {
      const found = items.find((i) => i.id === id);
      return found ? delay(found) : Promise.reject(new ApiError({ status: 404, detail: "Registo não encontrado." }));
    },
    create: (item: T) => {
      items = [item, ...items];
      persist();
      return delay(item);
    },
    update: (id: string, patch: Partial<T>) => {
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return Promise.reject(new ApiError({ status: 404, detail: "Registo não encontrado." }));
      const updated = { ...items[index], ...patch };
      items = [...items.slice(0, index), updated, ...items.slice(index + 1)];
      persist();
      return delay(updated);
    },
  };
}

export const newMockId = () => crypto.randomUUID();
