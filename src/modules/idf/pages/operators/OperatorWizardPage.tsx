import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { FileUploadField } from "@/components/idf/FileUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { listDocumentTypes } from "@/modules/idf/api/admin";
import { createOperator } from "@/modules/idf/api/operators";
import { PROVINCES } from "@/modules/idf/config/modules";
import { ApiError, type RegisterOperatorRequest, type OperatorType } from "@/modules/idf/types";
import { cn } from "@/lib/utils";

const STEPS = ["Dados legais", "Morada", "Contactos", "Documentos", "Revisão"];

const TYPES: { value: OperatorType; label: string }[] = [
  { value: "Individual", label: "Individual" },
  { value: "Company", label: "Empresa" },
  { value: "Cooperative", label: "Cooperativa" },
  { value: "PublicEntity", label: "Entidade pública" },
];

const emptyForm: RegisterOperatorRequest = {
  legalName: "",
  taxIdentificationNumber: "",
  type: "Company",
  address: { street: "", municipality: "", province: "" },
  contacts: [{ name: "", email: "", phoneNumber: "", isPrimary: true }],
  documents: [],
};

const OperatorWizardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegisterOperatorRequest>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { data: documentTypes = [] } = useQuery({
    queryKey: ["idf", "document-types"],
    queryFn: () => listDocumentTypes({ pageSize: 200 }).then((r) => r.items),
  });

  const mutation = useMutation({
    mutationFn: createOperator,
    onSuccess: (operator) => {
      queryClient.invalidateQueries({ queryKey: ["idf", "operators"] });
      toast({ title: "Operador criado", description: "Registo guardado em rascunho. Pode agora submetê-lo." });
      navigate(`/idf/operators/${operator.id}`);
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        setErrors(error.problem.errors ?? {});
        if (!error.problem.errors) {
          toast({ variant: "destructive", title: "Não foi possível criar", description: error.problem.detail });
        }
      }
    },
  });

  const fieldError = (field: string) => errors[field]?.[0];

  const canAdvance = () => {
    if (step === 0) return form.legalName.trim() && form.taxIdentificationNumber.trim();
    if (step === 1) return form.address.province;
    if (step === 2) return form.contacts.some((c) => c.isPrimary && c.name.trim() && c.email.trim());
    if (step === 3) return form.documents.every((d) => d.documentType && d.fileReference);
    return true;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registo de operador florestal"
        description="Wizard de 5 passos conforme a especificação do módulo IDF_30."
        crumbs={[{ label: "Cadastro" }, { label: "Operadores", to: "/idf/operators" }, { label: "Novo" }]}
      />

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              index === step
                ? "border-primary bg-primary text-primary-foreground"
                : index < step
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
            )}
          >
            {index < step ? <Check className="h-3.5 w-3.5" /> : <span>{index + 1}</span>}
            {label}
          </li>
        ))}
      </ol>

      <Card>
        <CardContent className="space-y-5 p-6">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="legalName">Denominação legal *</Label>
                <Input
                  id="legalName"
                  value={form.legalName}
                  onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                />
                {fieldError("legalName") && <p className="text-sm text-destructive">{fieldError("legalName")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input
                  id="nif"
                  value={form.taxIdentificationNumber}
                  onChange={(e) => setForm({ ...form, taxIdentificationNumber: e.target.value })}
                />
                {fieldError("taxIdentificationNumber") && (
                  <p className="text-sm text-destructive">{fieldError("taxIdentificationNumber")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value as OperatorType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={form.address.street}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Município</Label>
                <Input
                  id="municipality"
                  value={form.address.municipality}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, municipality: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Província</Label>
                <Select
                  value={form.address.province}
                  onValueChange={(value) => setForm({ ...form, address: { ...form.address, province: value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {form.contacts.map((contact, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => {
                        const contacts = [...form.contacts];
                        contacts[index] = { ...contact, name: e.target.value };
                        setForm({ ...form, contacts });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contact.email}
                      onChange={(e) => {
                        const contacts = [...form.contacts];
                        contacts[index] = { ...contact, email: e.target.value };
                        setForm({ ...form, contacts });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={contact.phoneNumber ?? ""}
                      onChange={(e) => {
                        const contacts = [...form.contacts];
                        contacts[index] = { ...contact, phoneNumber: e.target.value };
                        setForm({ ...form, contacts });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between md:col-span-3">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={contact.isPrimary}
                        onCheckedChange={(checked) => {
                          const contacts = form.contacts.map((c, i) => ({ ...c, isPrimary: i === index && !!checked }));
                          setForm({ ...form, contacts });
                        }}
                      />
                      Contacto principal
                    </label>
                    {form.contacts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm({ ...form, contacts: form.contacts.filter((_, i) => i !== index) })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm({ ...form, contacts: [...form.contacts, { name: "", email: "", phoneNumber: "", isPrimary: false }] })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar contacto
              </Button>
              {fieldError("contacts") && <p className="text-sm text-destructive">{fieldError("contacts")}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {form.documents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ainda sem documentos. Os tipos obrigatórios estão definidos em Administração → Tipos de documento.
                </p>
              )}
              {form.documents.map((document, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo de documento</Label>
                    <Select
                      value={document.documentType}
                      onValueChange={(value) => {
                        const documents = [...form.documents];
                        documents[index] = { ...document, documentType: value };
                        setForm({ ...form, documents });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((t) => (
                          <SelectItem key={t.code} value={t.code}>
                            {t.name}
                            {t.isRequired ? " (obrigatório)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número do documento</Label>
                    <Input
                      value={document.documentNumber}
                      onChange={(e) => {
                        const documents = [...form.documents];
                        documents[index] = { ...document, documentNumber: e.target.value };
                        setForm({ ...form, documents });
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FileUploadField
                      id={`document-file-${index}`}
                      label="Ficheiro *"
                      value={document.fileReference}
                      onChange={(fileReference) => {
                        const documents = [...form.documents];
                        documents[index] = { ...document, fileReference };
                        setForm({ ...form, documents });
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm({ ...form, documents: form.documents.filter((_, i) => i !== index) })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover documento
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm({
                    ...form,
                    documents: [...form.documents, { documentType: "", documentNumber: "", fileReference: null }],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar documento
              </Button>
            </div>
          )}

          {step === 4 && (
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Denominação legal</dt>
                <dd className="font-medium">{form.legalName || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">NIF</dt>
                <dd className="font-medium">{form.taxIdentificationNumber || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tipo</dt>
                <dd className="font-medium">{TYPES.find((t) => t.value === form.type)?.label}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Morada</dt>
                <dd className="font-medium">
                  {[form.address.street, form.address.municipality, form.address.province].filter(Boolean).join(", ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Contactos</dt>
                <dd className="font-medium">{form.contacts.length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Documentos</dt>
                <dd className="font-medium">{form.documents.length}</dd>
              </div>
            </dl>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <Button variant="outline" onClick={() => (step === 0 ? navigate("/idf/operators") : setStep(step - 1))}>
              {step === 0 ? "Cancelar" : "Anterior"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button disabled={!canAdvance()} onClick={() => setStep(step + 1)}>
                Seguinte
              </Button>
            ) : (
              <Button disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>
                {mutation.isPending ? "A guardar..." : "Guardar rascunho"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorWizardPage;
