import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { FileUploadField } from "@/components/idf/FileUploadField";
import { PolygonBoundaryDrawer } from "@/components/idf/PolygonBoundaryDrawer";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { businessDaysElapsed } from "@/lib/businessDays";
import { cn } from "@/lib/utils";
import { fieldError, toProblem } from "@/modules/idf/hooks/useProblem";
import { loadResidentOfficers } from "@/modules/idf/mock/residentOfficers";
import {
  TECHNICAL_INSTRUMENT_KEYS,
  TECHNICAL_INSTRUMENT_LABELS,
  patchExtension,
  setInstrumentFile,
  type ConcessionExtension,
} from "@/modules/idf/mock/concessionProcess";
import {
  ARTICLE_167_CHARGE_KEYS,
  ARTICLE_167_CHARGE_LABELS,
  ATTACHMENT_KEYS,
  ATTACHMENT_LABELS,
  PHASE_DEFINITIONS,
  decisionCompetenceFor,
  emptyCharges,
  emptyPhaseAData,
  emptyPhaseBData,
  emptyPhaseCData,
  emptyPhaseDData,
  emptyPhaseEData,
  emptyPhaseFData,
  emptyPhaseHData,
  saveCompletePhase,
  saveFAppeal,
  type Article167Charge,
  type Article167ChargeKey,
  type PhaseAData,
  type PhaseBData,
  type PhaseCData,
  type PhaseCode,
  type PhaseDData,
  type PhaseEData,
  type PhaseFData,
  type PhaseHData,
  type PhaseState,
  type PhaseStatus,
} from "@/modules/idf/mock/concessionPhases";

/**
 * Timeline + mini-formulários das 8 fases legais (A–H) da tramitação de activação da Concessão.
 * Cada fase abre o seu formulário quando `em_curso`; `concluida` mostra um resumo read-only;
 * `pendente`/`bloqueada` ficam cinzentas. Dono da sua própria mutação (mesmo padrão de
 * `PaymentPanel`) — só pede ao chamador para invalidar a query da extensão e, na Fase H, disparar
 * a transição `approveConcession` (mock — ver `api/concessions.ts`).
 */

const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  pendente: "Pendente",
  em_curso: "Em curso",
  concluida: "Concluída",
  bloqueada: "Bloqueada",
};
const PHASE_STATUS_TONES: Record<PhaseStatus, string> = {
  pendente: "bg-muted text-muted-foreground",
  em_curso: "bg-info/15 text-info",
  concluida: "bg-success/15 text-success",
  bloqueada: "bg-destructive/15 text-destructive",
};
const PhaseStatusChip = ({ status }: { status: PhaseStatus }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", PHASE_STATUS_TONES[status])}>
    {PHASE_STATUS_LABELS[status]}
  </span>
);

const PhaseDeadline = ({ phase }: { phase: PhaseState }) => {
  const def = PHASE_DEFINITIONS.find((d) => d.code === phase.code)!;
  if (!def.legalDeadlineDays || !def.deadlineUnit || !phase.startedAt) {
    return <p className="text-xs text-muted-foreground">Sem prazo legal fixado.</p>;
  }
  const endISO = phase.endedAt ?? new Date().toISOString();
  const elapsed =
    def.deadlineUnit === "business"
      ? businessDaysElapsed(phase.startedAt, endISO)
      : Math.floor((new Date(endISO).getTime() - new Date(phase.startedAt).getTime()) / 86_400_000);
  const percent = Math.min(100, Math.round((elapsed / def.legalDeadlineDays) * 100));
  const tone = percent >= 80 ? "bg-destructive" : percent >= 60 ? "bg-warning" : "bg-primary";
  const unitLabel = def.deadlineUnit === "business" ? "dias úteis" : "dias";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Prazo</span>
        <span>
          {elapsed} / {def.legalDeadlineDays} {unitLabel} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const humanizeKey = (key: string) => {
  const spaced = key.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};
const formatSummaryValue = (v: unknown): string => {
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  if (Array.isArray(v)) return v.length ? `${v.length} item(ns)` : "—";
  if (v && typeof v === "object") return Object.entries(v as Record<string, unknown>).map(([k, val]) => `${humanizeKey(k)}: ${val}`).join(" · ");
  return String(v);
};
const PhaseSummary = ({ data }: { data: Record<string, unknown> }) => {
  const rows = Object.entries(data).filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0));
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">Sem dados registados.</p>;
  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      {rows.map(([key, v]) => (
        <div key={key}>
          <dt className="text-xs text-muted-foreground">{humanizeKey(key)}</dt>
          <dd className="font-medium">{formatSummaryValue(v)}</dd>
        </div>
      ))}
    </dl>
  );
};

const buildFormState = (extension: ConcessionExtension): Record<PhaseCode, Record<string, unknown>> => {
  const defaults: Partial<Record<PhaseCode, () => Record<string, unknown>>> = {
    A: emptyPhaseAData as unknown as () => Record<string, unknown>,
    B: emptyPhaseBData as unknown as () => Record<string, unknown>,
    C: emptyPhaseCData as unknown as () => Record<string, unknown>,
    D: emptyPhaseDData as unknown as () => Record<string, unknown>,
    E: emptyPhaseEData as unknown as () => Record<string, unknown>,
    F: emptyPhaseFData as unknown as () => Record<string, unknown>,
    H: emptyPhaseHData as unknown as () => Record<string, unknown>,
  };
  const state = {} as Record<PhaseCode, Record<string, unknown>>;
  for (const phase of extension.phases) {
    const seed = defaults[phase.code]?.() ?? {};
    state[phase.code] = { ...seed, ...phase.data };
  }
  return state;
};

interface ConcessionPhaseTimelineProps {
  extension: ConcessionExtension;
  onPhaseHCompleted: () => void;
  refresh: () => void;
}

export const ConcessionPhaseTimeline = ({ extension, onPhaseHCompleted, refresh }: ConcessionPhaseTimelineProps) => {
  const [formState, setFormState] = useState(() => buildFormState(extension));
  const [errors, setErrors] = useState<Partial<Record<PhaseCode, Record<string, string[]>>>>({});
  const [appealForm, setAppealForm] = useState({ justification: "", fileReference: null as string | null });
  const [chargesForm, setChargesForm] = useState<Record<Article167ChargeKey, Article167Charge>>(extension.charges ?? emptyCharges());

  const currentOpen = extension.phases.find((p) => p.status === "em_curso")?.code;

  const update = (code: PhaseCode, patch: Record<string, unknown>) =>
    setFormState((prev) => ({ ...prev, [code]: { ...prev[code], ...patch } }));

  const complete = useMutation({
    mutationFn: (vars: { code: PhaseCode; data: Record<string, unknown> }) => saveCompletePhase(extension, vars.code, vars.data),
    onSuccess: (_result, vars) => {
      setErrors((prev) => ({ ...prev, [vars.code]: undefined }));
      refresh();
      if (vars.code === "H") onPhaseHCompleted();
    },
    onError: (err, vars) => setErrors((prev) => ({ ...prev, [vars.code]: toProblem(err).errors ?? {} })),
  });

  const appeal = useMutation({
    mutationFn: () => saveFAppeal(extension, { ...appealForm, submittedAt: new Date().toISOString() }),
    onSuccess: () => {
      setAppealForm({ justification: "", fileReference: null });
      refresh();
    },
  });

  const uploadInstrument = useMutation({
    mutationFn: (vars: { key: (typeof TECHNICAL_INSTRUMENT_KEYS)[number]; fileReference: string | null }) =>
      setInstrumentFile(extension.id, vars.key, vars.fileReference, extension.instruments),
    onSuccess: refresh,
  });

  const saveCharges = useMutation({
    mutationFn: () => patchExtension(extension.id, { charges: chargesForm }),
    onSuccess: refresh,
  });

  const instrumentsReady = TECHNICAL_INSTRUMENT_KEYS.every((k) => extension.instruments[k].status === "Approved");
  const chargesReady = ARTICLE_167_CHARGE_KEYS.every((k) => chargesForm[k].amount > 0 && chargesForm[k].paymentReceiptFileReference);

  return (
    <div className="space-y-4">
      <ol className="flex flex-wrap gap-2">
        {extension.phases.map((phase) => {
          const def = PHASE_DEFINITIONS.find((d) => d.code === phase.code)!;
          return (
            <li key={phase.code} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
              <span className="font-bold">{phase.code}</span>
              <span className="text-muted-foreground">{def.name}</span>
              <PhaseStatusChip status={phase.status} />
            </li>
          );
        })}
      </ol>

      <Accordion type="single" collapsible defaultValue={currentOpen} className="rounded-lg border">
        {extension.phases.map((phase) => {
          const def = PHASE_DEFINITIONS.find((d) => d.code === phase.code)!;
          const isEditable = phase.status === "em_curso";
          const phaseErrors = errors[phase.code] ?? {};

          return (
            <AccordionItem key={phase.code} value={phase.code} disabled={phase.status === "pendente"}>
              <AccordionTrigger className="px-4">
                <span className="flex flex-1 items-center gap-3 text-left">
                  <span className="font-bold">Fase {phase.code}</span>
                  <span className="text-sm text-muted-foreground">{def.name}</span>
                  <PhaseStatusChip status={phase.status} />
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 px-4 pb-4">
                <PhaseDeadline phase={phase} />

                {phase.status === "concluida" && <PhaseSummary data={phase.data} />}
                {phase.status === "pendente" && <p className="text-sm text-muted-foreground">Ainda não iniciada.</p>}

                {phase.status === "bloqueada" && phase.code === "F" && (
                  <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">Indeferido — a aguardar reclamação para reabrir a fase.</p>
                    <Textarea
                      placeholder="Fundamentação da reclamação"
                      value={appealForm.justification}
                      onChange={(e) => setAppealForm((prev) => ({ ...prev, justification: e.target.value }))}
                    />
                    <FileUploadField
                      id="f-appeal-file"
                      label="Anexo da reclamação"
                      value={appealForm.fileReference}
                      onChange={(v) => setAppealForm((prev) => ({ ...prev, fileReference: v }))}
                    />
                    <Button size="sm" disabled={!appealForm.justification.trim() || appeal.isPending} onClick={() => appeal.mutate()}>
                      Apresentar reclamação
                    </Button>
                  </div>
                )}

                {isEditable && phase.code === "A" && (
                  <PhaseAForm value={formState.A as unknown as PhaseAData} onChange={(patch) => update("A", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "B" && (
                  <PhaseBForm value={formState.B as unknown as PhaseBData} onChange={(patch) => update("B", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "C" && (
                  <PhaseCForm value={formState.C as unknown as PhaseCData} onChange={(patch) => update("C", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "D" && (
                  <PhaseDForm value={formState.D as unknown as PhaseDData} onChange={(patch) => update("D", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "E" && (
                  <PhaseEForm value={formState.E as unknown as PhaseEData} onChange={(patch) => update("E", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "F" && (
                  <PhaseFForm value={formState.F as unknown as PhaseFData} onChange={(patch) => update("F", patch)} errors={phaseErrors} />
                )}
                {isEditable && phase.code === "G" && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold">Instrumentos técnicos</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {TECHNICAL_INSTRUMENT_KEYS.map((key) => (
                          <div key={key} className="space-y-2 rounded-lg border p-3">
                            <div className="flex items-center justify-between gap-2">
                              <Label className="text-sm">{TECHNICAL_INSTRUMENT_LABELS[key]}</Label>
                              <StatusBadge status={extension.instruments[key].status} />
                            </div>
                            <FileUploadField
                              id={`instrument-${key}`}
                              label="Ficheiro"
                              value={extension.instruments[key].fileReference}
                              onChange={(fileReference) => uploadInstrument.mutate({ key, fileReference })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold">Encargos do Art. 167.º</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {ARTICLE_167_CHARGE_KEYS.map((key) => (
                          <div key={key} className="space-y-2 rounded-lg border p-3">
                            <Label className="text-sm">{ARTICLE_167_CHARGE_LABELS[key]}</Label>
                            <Input
                              type="number"
                              placeholder="Valor"
                              value={chargesForm[key].amount || ""}
                              onChange={(e) => setChargesForm((prev) => ({ ...prev, [key]: { ...prev[key], amount: Number(e.target.value) } }))}
                            />
                            <FileUploadField
                              id={`charge-${key}`}
                              label="Comprovativo de pagamento"
                              value={chargesForm[key].paymentReceiptFileReference}
                              onChange={(v) => setChargesForm((prev) => ({ ...prev, [key]: { ...prev[key], paymentReceiptFileReference: v } }))}
                            />
                          </div>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="mt-3" disabled={saveCharges.isPending} onClick={() => saveCharges.mutate()}>
                        Guardar encargos
                      </Button>
                    </div>
                    {!instrumentsReady && <p className="text-xs text-muted-foreground">Fase só conclui com os 8 instrumentos Aprovados.</p>}
                    {!chargesReady && <p className="text-xs text-muted-foreground">Fase só conclui com os 4 encargos liquidados (valor + comprovativo).</p>}
                  </div>
                )}
                {isEditable && phase.code === "H" && (
                  <PhaseHForm
                    value={formState.H as unknown as PhaseHData}
                    onChange={(patch) => update("H", patch)}
                    errors={phaseErrors}
                    competence={decisionCompetenceFor(extension.parcelAreaHectares)}
                  />
                )}

                {isEditable && phase.code !== "G" && (
                  <Button size="sm" disabled={complete.isPending} onClick={() => complete.mutate({ code: phase.code, data: formState[phase.code] })}>
                    Concluir Fase {phase.code}
                  </Button>
                )}
                {isEditable && phase.code === "G" && (
                  <Button
                    size="sm"
                    disabled={complete.isPending || !instrumentsReady || !chargesReady}
                    onClick={() =>
                      complete.mutate({
                        code: "G",
                        data: { instrumentsAprovados: TECHNICAL_INSTRUMENT_KEYS.length, encargosLiquidados: ARTICLE_167_CHARGE_KEYS.length },
                      })
                    }
                  >
                    Concluir Fase G
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

/* ------------------------------------------------------------------------------ Mini-formulários */

const PhaseAForm = ({ value, onChange, errors }: { value: PhaseAData; onChange: (p: Partial<PhaseAData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground">Anexos do requerimento (F-08).</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {ATTACHMENT_KEYS.map((key) => (
        <FileUploadField
          key={key}
          id={`attachment-${key}`}
          label={ATTACHMENT_LABELS[key]}
          value={value.attachments[key]}
          onChange={(v) => onChange({ attachments: { ...value.attachments, [key]: v } })}
          error={fieldError(errors, `attachments.${key}`)}
        />
      ))}
    </div>
  </div>
);

const PhaseBForm = ({ value, onChange, errors }: { value: PhaseBData; onChange: (p: Partial<PhaseBData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Resultado da consulta ao cadastro de terras</Label>
      <RadioGroup
        value={value.landCadastreConsultationResult === null ? "" : String(value.landCadastreConsultationResult)}
        onValueChange={(v) => onChange({ landCadastreConsultationResult: v === "true" })}
        className="flex gap-4"
      >
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="true" /> Sim
        </label>
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="false" /> Não
        </label>
      </RadioGroup>
      {fieldError(errors, "landCadastreConsultationResult") && <p className="text-sm text-destructive">{fieldError(errors, "landCadastreConsultationResult")}</p>}
    </div>
    <Textarea placeholder="Detalhe da consulta" value={value.landCadastreConsultationDetail} onChange={(e) => onChange({ landCadastreConsultationDetail: e.target.value })} />

    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={value.overlapDetected} onCheckedChange={(c) => onChange({ overlapDetected: Boolean(c) })} />
      Sobreposição detectada
    </label>
    {value.overlapDetected && (
      <>
        <Textarea placeholder="Fundamentação da sobreposição" value={value.overlapJustification} onChange={(e) => onChange({ overlapJustification: e.target.value })} />
        {fieldError(errors, "overlapJustification") && <p className="text-sm text-destructive">{fieldError(errors, "overlapJustification")}</p>}
      </>
    )}

    <div className="space-y-2">
      <Label>Conclusão sobre potencial florestal</Label>
      <RadioGroup
        value={value.forestPotentialConfirmed === null ? "" : String(value.forestPotentialConfirmed)}
        onValueChange={(v) => onChange({ forestPotentialConfirmed: v === "true" })}
        className="flex gap-4"
      >
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="true" /> Favorável
        </label>
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="false" /> Desfavorável
        </label>
      </RadioGroup>
      {fieldError(errors, "forestPotentialConfirmed") && <p className="text-sm text-destructive">{fieldError(errors, "forestPotentialConfirmed")}</p>}
    </div>
    <Textarea placeholder="Fundamentação do potencial florestal" value={value.forestPotentialJustification} onChange={(e) => onChange({ forestPotentialJustification: e.target.value })} />

    <div className="space-y-2">
      <Label>Avaliação de idoneidade e capacidade técnica/financeira</Label>
      <Select value={value.suitabilityAssessment ?? ""} onValueChange={(v) => onChange({ suitabilityAssessment: v as PhaseBData["suitabilityAssessment"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Confirmed">Confirmada</SelectItem>
          <SelectItem value="NotConfirmed">Não confirmada</SelectItem>
        </SelectContent>
      </Select>
      {fieldError(errors, "suitabilityAssessment") && <p className="text-sm text-destructive">{fieldError(errors, "suitabilityAssessment")}</p>}
    </div>
  </div>
);

const PhaseCForm = ({ value, onChange, errors }: { value: PhaseCData; onChange: (p: Partial<PhaseCData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-4">
    <FileUploadField
      id="c-travel-subsidy"
      label="Comprovativo de liquidação de subsídios de deslocação"
      value={value.travelSubsidyReceiptFileReference}
      onChange={(v) => onChange({ travelSubsidyReceiptFileReference: v })}
      error={fieldError(errors, "travelSubsidyReceiptFileReference")}
    />
    <FileUploadField
      id="c-survey-fee"
      label="Comprovativo de liquidação de taxas de vistoria"
      value={value.surveyFeeReceiptFileReference}
      onChange={(v) => onChange({ surveyFeeReceiptFileReference: v })}
      error={fieldError(errors, "surveyFeeReceiptFileReference")}
    />
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Técnico do IDF</Label>
        <Input value={value.idfTechnician} onChange={(e) => onChange({ idfTechnician: e.target.value })} />
        {fieldError(errors, "idfTechnician") && <p className="text-sm text-destructive">{fieldError(errors, "idfTechnician")}</p>}
      </div>
      <div className="space-y-2">
        <Label>Técnico do IGCA</Label>
        <Input value={value.igcaTechnician} onChange={(e) => onChange({ igcaTechnician: e.target.value })} />
        {fieldError(errors, "igcaTechnician") && <p className="text-sm text-destructive">{fieldError(errors, "igcaTechnician")}</p>}
      </div>
    </div>
    <Textarea placeholder="Conclusão sobre sobreposição de direitos" value={value.overlapConclusion} onChange={(e) => onChange({ overlapConclusion: e.target.value })} />
    <div className="space-y-2">
      <Label>Capacidade volumétrica (m³)</Label>
      <Input type="number" value={value.volumetricCapacity || ""} onChange={(e) => onChange({ volumetricCapacity: Number(e.target.value) })} />
    </div>
    <PolygonBoundaryDrawer label="Coordenadas de campo" value={value.fieldCoordinates} onChange={(v) => onChange({ fieldCoordinates: v })} />
  </div>
);

const PhaseDForm = ({ value, onChange, errors }: { value: PhaseDData; onChange: (p: Partial<PhaseDData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Sentido do parecer</Label>
      <Select value={value.opinion ?? ""} onValueChange={(v) => onChange({ opinion: v as PhaseDData["opinion"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Favorable">Favorável</SelectItem>
          <SelectItem value="Unfavorable">Desfavorável</SelectItem>
        </SelectContent>
      </Select>
      {fieldError(errors, "opinion") && <p className="text-sm text-destructive">{fieldError(errors, "opinion")}</p>}
    </div>
    <Textarea placeholder="Fundamentação" value={value.justification} onChange={(e) => onChange({ justification: e.target.value })} />
    {fieldError(errors, "justification") && <p className="text-sm text-destructive">{fieldError(errors, "justification")}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Assinado por</Label>
        <Input value={value.signedBy} onChange={(e) => onChange({ signedBy: e.target.value })} />
        {fieldError(errors, "signedBy") && <p className="text-sm text-destructive">{fieldError(errors, "signedBy")}</p>}
      </div>
      <div className="space-y-2">
        <Label>Data</Label>
        <Input type="date" value={value.signedAt} onChange={(e) => onChange({ signedAt: e.target.value })} />
      </div>
    </div>
  </div>
);

const PhaseEForm = ({ value, onChange, errors }: { value: PhaseEData; onChange: (p: Partial<PhaseEData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Sentido da decisão</Label>
      <Select value={value.decisionSense ?? ""} onValueChange={(v) => onChange({ decisionSense: v as PhaseEData["decisionSense"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Approval">Deferimento</SelectItem>
          <SelectItem value="Rejection">Indeferimento</SelectItem>
        </SelectContent>
      </Select>
      {fieldError(errors, "decisionSense") && <p className="text-sm text-destructive">{fieldError(errors, "decisionSense")}</p>}
    </div>
    {value.decisionSense === "Rejection" && (
      <>
        <Textarea placeholder="Razões do indeferimento" value={value.rejectionReasons} onChange={(e) => onChange({ rejectionReasons: e.target.value })} />
        {fieldError(errors, "rejectionReasons") && <p className="text-sm text-destructive">{fieldError(errors, "rejectionReasons")}</p>}
      </>
    )}
    <div className="space-y-2">
      <Label>Condições especiais de exploração</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input placeholder="Área" value={value.specialConditions.area} onChange={(e) => onChange({ specialConditions: { ...value.specialConditions, area: e.target.value } })} />
        <Input placeholder="Espécies" value={value.specialConditions.species} onChange={(e) => onChange({ specialConditions: { ...value.specialConditions, species: e.target.value } })} />
        <Input placeholder="Produtos" value={value.specialConditions.products} onChange={(e) => onChange({ specialConditions: { ...value.specialConditions, products: e.target.value } })} />
        <Input
          placeholder="Grau de industrialização"
          value={value.specialConditions.industrializationLevel}
          onChange={(e) => onChange({ specialConditions: { ...value.specialConditions, industrializationLevel: e.target.value } })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Impacto local ou regional</Label>
      <Select value={value.localRegionalImpact ?? ""} onValueChange={(v) => onChange({ localRegionalImpact: v as PhaseEData["localRegionalImpact"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Positive">Positivo</SelectItem>
          <SelectItem value="Negative">Negativo</SelectItem>
        </SelectContent>
      </Select>
      {fieldError(errors, "localRegionalImpact") && <p className="text-sm text-destructive">{fieldError(errors, "localRegionalImpact")}</p>}
    </div>
    <Textarea placeholder="Detalhe do impacto" value={value.impactDetail} onChange={(e) => onChange({ impactDetail: e.target.value })} />
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Assinatura IDF</Label>
        <Input value={value.idfSignedBy} onChange={(e) => onChange({ idfSignedBy: e.target.value })} />
        {fieldError(errors, "idfSignedBy") && <p className="text-sm text-destructive">{fieldError(errors, "idfSignedBy")}</p>}
      </div>
      <div className="space-y-2">
        <Label>Assinatura DNF</Label>
        <Input value={value.dnfSignedBy} onChange={(e) => onChange({ dnfSignedBy: e.target.value })} />
        {fieldError(errors, "dnfSignedBy") && <p className="text-sm text-destructive">{fieldError(errors, "dnfSignedBy")}</p>}
      </div>
    </div>
  </div>
);

const PhaseFForm = ({ value, onChange, errors }: { value: PhaseFData; onChange: (p: Partial<PhaseFData>) => void; errors: Record<string, string[]> }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Sentido do despacho</Label>
      <Select value={value.decision ?? ""} onValueChange={(v) => onChange({ decision: v as PhaseFData["decision"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Approved">Deferido</SelectItem>
          <SelectItem value="Rejected">Indeferido</SelectItem>
        </SelectContent>
      </Select>
      {fieldError(errors, "decision") && <p className="text-sm text-destructive">{fieldError(errors, "decision")}</p>}
    </div>
    <div className="space-y-2">
      <Label>Data de comunicação</Label>
      <Input type="date" value={value.communicatedAt} onChange={(e) => onChange({ communicatedAt: e.target.value })} />
      {fieldError(errors, "communicatedAt") && <p className="text-sm text-destructive">{fieldError(errors, "communicatedAt")}</p>}
    </div>
    {value.decision === "Rejected" && (
      <p className="text-xs text-muted-foreground">Ao concluir com indeferimento, a fase fica bloqueada a aguardar reclamação.</p>
    )}
  </div>
);

const PhaseHForm = ({
  value,
  onChange,
  errors,
  competence,
}: {
  value: PhaseHData;
  onChange: (p: Partial<PhaseHData>) => void;
  errors: Record<string, string[]>;
  competence: string;
}) => {
  const businessDaysToPublish = value.contractSignedAt && value.publishedAt ? businessDaysElapsed(value.contractSignedAt, value.publishedAt) : null;
  const overdue = businessDaysToPublish !== null && businessDaysToPublish > 5;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Competência decisória</Label>
        <Input readOnly disabled value={competence} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Data de celebração do contrato</Label>
          <Input type="date" value={value.contractSignedAt} onChange={(e) => onChange({ contractSignedAt: e.target.value })} />
          {fieldError(errors, "contractSignedAt") && <p className="text-sm text-destructive">{fieldError(errors, "contractSignedAt")}</p>}
        </div>
        <div className="space-y-2">
          <Label>Data de publicação no Diário da República</Label>
          <Input type="date" value={value.publishedAt} onChange={(e) => onChange({ publishedAt: e.target.value })} />
          {fieldError(errors, "publishedAt") && <p className="text-sm text-destructive">{fieldError(errors, "publishedAt")}</p>}
        </div>
      </div>
      {overdue && <p className="text-sm text-destructive">Publicação além dos 5 dias úteis após a celebração ({businessDaysToPublish} dias úteis).</p>}

      <FileUploadField id="h-contract-1" label="Contrato celebrado — 1ª via" value={value.contractFileReference1} onChange={(v) => onChange({ contractFileReference1: v })} error={fieldError(errors, "contractFileReference1")} />
      <FileUploadField id="h-contract-2" label="Contrato celebrado — 2ª via" value={value.contractFileReference2} onChange={(v) => onChange({ contractFileReference2: v })} error={fieldError(errors, "contractFileReference2")} />
      <FileUploadField id="h-land-plan" label="Planta dos terrenos" value={value.landPlanFileReference} onChange={(v) => onChange({ landPlanFileReference: v })} error={fieldError(errors, "landPlanFileReference")} />

      <EntityPicker
        id="h-resident-officer"
        label="Fiscal residente designado"
        queryKey={["idf", "picker", "resident-officers"]}
        load={loadResidentOfficers}
        value={value.residentOfficerId ?? ""}
        onChange={(v) => onChange({ residentOfficerId: v })}
        error={fieldError(errors, "residentOfficerId")}
      />

      <div className="space-y-2">
        <Label>Pessoal privativo juramentado (opcional)</Label>
        <div className="space-y-2">
          {value.privateSwornStaff.map((name, index) => (
            <div key={index} className="flex gap-2">
              <Input value={name} onChange={(e) => onChange({ privateSwornStaff: value.privateSwornStaff.map((n, i) => (i === index ? e.target.value : n)) })} />
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ privateSwornStaff: value.privateSwornStaff.filter((_, i) => i !== index) })}>
                Remover
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => onChange({ privateSwornStaff: [...value.privateSwornStaff, ""] })}>
            Acrescentar nome
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConcessionPhaseTimeline;
