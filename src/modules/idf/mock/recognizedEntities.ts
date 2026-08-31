import type { PickerOption } from "@/components/idf/EntityPicker";

/**
 * "Entidades Reconhecidas" (NER) — conceito novo do prompt, sem endpoint no backend. Usado como
 * autor de inventário florestal anterior (Registo de Área) e como autor de estudo faunístico
 * (Licenciamento, Aba 3). Seed fixa de protótipo — sem CRUD próprio pedido na especificação.
 */

export type RecognizedEntityScope = "InventoryAuthor" | "FaunaStudy";

interface RecognizedEntity {
  id: string;
  name: string;
  scope: RecognizedEntityScope[];
}

const RECOGNIZED_ENTITIES: RecognizedEntity[] = [
  { id: "ner-1", name: "Instituto Superior de Ciências Florestais", scope: ["InventoryAuthor"] },
  { id: "ner-2", name: "Faculdade de Ciências Agrárias — UAN", scope: ["InventoryAuthor", "FaunaStudy"] },
  { id: "ner-3", name: "Gabinete Técnico Florestal, Lda.", scope: ["InventoryAuthor"] },
  { id: "ner-4", name: "Instituto Nacional da Biodiversidade e Áreas de Conservação", scope: ["FaunaStudy"] },
  { id: "ner-5", name: "Sociedade Angolana de Fauna Silvestre", scope: ["FaunaStudy"] },
];

export const loadRecognizedEntities = async (scope: RecognizedEntityScope): Promise<PickerOption[]> =>
  RECOGNIZED_ENTITIES.filter((e) => e.scope.includes(scope)).map((e) => ({ value: e.id, label: e.name }));
