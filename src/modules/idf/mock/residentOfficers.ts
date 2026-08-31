import type { PickerOption } from "@/components/idf/EntityPicker";

/**
 * Fiscais residentes — conceito novo do prompt (designação formal na Fase H da tramitação), sem
 * endpoint no backend. Seed fixa de protótipo, mesmo padrão de `recognizedEntities.ts`.
 */

interface ResidentOfficer {
  id: string;
  name: string;
  registrationNumber: string;
}

const RESIDENT_OFFICERS: ResidentOfficer[] = [
  { id: "fisc-1", name: "Domingos Chissano", registrationNumber: "FR-014" },
  { id: "fisc-2", name: "Isabel Sacadura", registrationNumber: "FR-027" },
  { id: "fisc-3", name: "Manuel Kianda", registrationNumber: "FR-033" },
  { id: "fisc-4", name: "Ana Bumba", registrationNumber: "FR-041" },
];

export const loadResidentOfficers = async (): Promise<PickerOption[]> =>
  RESIDENT_OFFICERS.map((o) => ({ value: o.id, label: o.name, hint: o.registrationNumber }));

export const getResidentOfficerName = (id: string | null): string | null =>
  RESIDENT_OFFICERS.find((o) => o.id === id)?.name ?? null;
