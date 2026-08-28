import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requestLicense } from "@/modules/idf/api/licenses";
import { getConcession } from "@/modules/idf/api/concessions";
import { loadActiveConcessions, loadApprovedQuotas } from "@/modules/idf/api/pickers";
import { fieldError, toProblem } from "@/modules/idf/hooks/useProblem";
import { useToast } from "@/hooks/use-toast";
import type { RequestLicenseRequest } from "@/modules/idf/types";
import { cn } from "@/lib/utils";

const STEPS = ["Concessão e quota", "Volume e validade", "Rever e submeter"];

/** Wizard de 3 passos (a taxa deixou de ser definida na criação — passa a ser fixada no "marcar pendente de pagamento"). */
const LicenseWizardPage = () => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState<Omit<RequestLicenseRequest, "operatorId">>({
    concessionId: "",
    quotaId: "",
    authorizedVolume: 0,
    authorizedVolumeUnit: "m3",
    validityStartDate: "",
    validityEndDate: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: concession } = useQuery({
    queryKey: ["idf", "concessions", form.concessionId],
    queryFn: () => getConcession(form.concessionId),
    enabled: !!form.concessionId,
  });

  const submit = useMutation({
    mutationFn: () => requestLicense({ ...form, operatorId: concession!.forestOperatorId }),
    onSuccess: () => {
      toast({ title: "Pedido de licença criado", description: "Submeta e marque o pagamento para emitir a licença." });
      navigate("/idf/licenses");
    },
    onError: (error) => {
      const problem = toProblem(error);
      setErrors(problem.errors ?? {});
      if (!problem.errors) toast({ variant: "destructive", title: "Não foi possível guardar", description: problem.detail });
    },
  });

  const canAdvance =
    (step === 0 && form.concessionId && form.quotaId && concession) ||
    (step === 1 && form.authorizedVolume > 0 && form.validityStartDate && form.validityEndDate);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nova licença de exploração"
        description="Cadeia florestal: concessão → quota aprovada → licença."
        crumbs={[{ label: "Exploração" }, { label: "Licenças", to: "/idf/licenses" }, { label: "Nova" }]}
      />

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
              index === step ? "border-primary bg-primary/10 font-medium text-primary" : "text-muted-foreground",
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {index < step ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <Card>
        <CardContent className="space-y-5 p-4 md:p-6">
          {step === 0 && (
            <>
              <EntityPicker
                id="lic-concession"
                label="Concessão activa"
                queryKey={["idf", "picker", "active-concessions"]}
                load={loadActiveConcessions}
                value={form.concessionId}
                onChange={(v) => setForm({ ...form, concessionId: v, quotaId: "" })}
                emptyMessage="Sem concessões activas — não é possível pedir licença (regra 9.1)."
                error={fieldError(errors, "concessionId")}
              />
              <EntityPicker
                id="lic-quota"
                label="Quota aprovada"
                queryKey={["idf", "picker", "quotas", form.concessionId]}
                load={() => loadApprovedQuotas(form.concessionId || undefined)}
                value={form.quotaId}
                onChange={(v) => setForm({ ...form, quotaId: v })}
                emptyMessage="Sem quotas aprovadas para esta concessão."
                error={fieldError(errors, "quotaId")}
              />
            </>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="lic-volume">Volume autorizado (m3)</Label>
                <Input
                  id="lic-volume"
                  type="number"
                  value={form.authorizedVolume || ""}
                  onChange={(e) => setForm({ ...form, authorizedVolume: Number(e.target.value) })}
                />
                {fieldError(errors, "authorizedVolume") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "authorizedVolume")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lic-start">Início da validade</Label>
                <Input
                  id="lic-start"
                  type="date"
                  value={form.validityStartDate}
                  onChange={(e) => setForm({ ...form, validityStartDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lic-end">Fim da validade</Label>
                <Input
                  id="lic-end"
                  type="date"
                  value={form.validityEndDate}
                  onChange={(e) => setForm({ ...form, validityEndDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Concessão</dt>
                <dd className="font-medium">
                  <EntityLabel kind="concession" id={form.concessionId} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Quota</dt>
                <dd className="font-medium">
                  <EntityLabel kind="quota" id={form.quotaId} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Volume</dt>
                <dd className="font-medium">{form.authorizedVolume} m3</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Validade</dt>
                <dd className="font-medium">
                  {form.validityStartDate || "—"} → {form.validityEndDate || "—"}
                </dd>
              </div>
            </dl>
          )}

          <Separator />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => (step === 0 ? navigate("/idf/licenses") : setStep(step - 1))}>
              {step === 0 ? "Cancelar" : "Anterior"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button disabled={!canAdvance} onClick={() => setStep(step + 1)}>
                Seguinte
              </Button>
            ) : (
              <Button disabled={submit.isPending} onClick={() => submit.mutate()}>
                Submeter pedido
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseWizardPage;
