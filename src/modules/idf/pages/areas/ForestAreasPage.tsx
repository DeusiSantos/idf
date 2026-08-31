import { ExternalLink, LandPlot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { FileUploadField } from "@/components/idf/FileUploadField";
import { LocationFields } from "@/components/idf/LocationFields";
import { PolygonBoundaryDrawer } from "@/components/idf/PolygonBoundaryDrawer";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createForestArea, deriveProvinceFromBoundary, listForestAreas, mockNaturalVegetationPercent } from "@/modules/idf/api/areas";
import { loadRecognizedEntities } from "@/modules/idf/mock/recognizedEntities";
import { getAreaCommitment } from "@/modules/idf/mock/concessionProcess";
import { SERVICE } from "@/modules/idf/config/modules";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { polygonAreaHectares } from "@/lib/geoPolygon";
import {
  LAND_REGIME_MIN_VEGETATION,
  OVERLAP_LAYER_LABELS,
  type CreateForestAreaRequest,
  type ForestAreaDto,
  type LandRegime,
  type OverlapVerdict,
} from "@/modules/idf/types/areas";
import type { CoordinateDto } from "@/modules/idf/types";

const LAND_REGIMES: { value: LandRegime; label: string }[] = [
  { value: "Agricultural", label: "Terreno agrícola" },
  { value: "Forest", label: "Terreno florestal" },
];

const OVERLAY_COLORS = ["#2563eb", "#d97706", "#7c3aed", "#dc2626", "#0891b2", "#65a30d"];

/**
 * Componente próprio (não uma função solta) porque usa `useQuery` — o `detail` do
 * `ResourceWorkspace` só é chamado enquanto o painel lateral está aberto, por isso um hook
 * chamado directamente dentro do callback violaria as regras dos hooks.
 */
const AreaConcessionsSection = ({ area }: { area: ForestAreaDto }) => {
  const { data: commitment } = useQuery({
    queryKey: ["idf", "areas", area.id, "commitment"],
    queryFn: () => getAreaCommitment(area.id),
  });

  if (!commitment || commitment.items.length === 0) return null;

  return (
    <div className="space-y-3">
      <Separator />
      <p className="text-sm font-semibold">Concessões associadas</p>
      <PolygonBoundaryDrawer
        readOnly
        label="Área-mãe com as parcelas recortadas"
        value={area.boundary}
        onChange={() => undefined}
        overlayPolygons={commitment.items.map((it, index) => ({
          points: it.parcelBoundary,
          color: OVERLAY_COLORS[index % OVERLAY_COLORS.length],
          label: it.code,
        }))}
      />
      <div className="space-y-2">
        {commitment.items.map((it, index) => (
          <div key={it.concessionId} className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: OVERLAY_COLORS[index % OVERLAY_COLORS.length] }} aria-hidden />
              <span className="font-medium">{it.code}</span>
              <StatusBadge status={it.status} />
            </span>
            <span className="flex items-center gap-3 text-muted-foreground">
              {((it.parcelAreaHectares / area.calculatedAreaHectares) * 100).toFixed(1)}% da área-mãe
              <Button asChild variant="ghost" size="sm">
                <Link to={`/idf/concessions/${it.concessionId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ForestAreasPage = () => (
  <ResourceWorkspace<ForestAreaDto, CreateForestAreaRequest>
    service={SERVICE.AREAS}
    title="Registo de Área"
    description="Áreas florestais registadas, com polígono, área calculada e verificação de sobreposição contra 5 camadas obrigatórias."
    crumbs={[{ label: "Cadastro" }, { label: "Registo de Área" }]}
    queryKey="areas"
    searchPlaceholder="Pesquisar por código"
    emptyMessage="Sem áreas registadas"
    statuses={["Conforme", "ConformeComReserva", "NaoConforme"] satisfies OverlapVerdict[]}
    stats={[
      { key: "total", label: "Total", status: "all", icon: LandPlot },
      { key: "conforme", label: "Conformes", status: "Conforme", icon: LandPlot },
      { key: "reserva", label: "Com reserva", status: "ConformeComReserva", icon: LandPlot },
      { key: "naoconforme", label: "Não conformes", status: "NaoConforme", icon: LandPlot },
    ]}
    fetchPage={({ page, search, status }) =>
      listForestAreas({ page, pageSize: 10, code: search, status: status as OverlapVerdict | "all" })
    }
    getStatus={(item) => item.overlapVerdict}
    getTitle={(item) => item.code}
    columns={[
      { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.code}</span> },
      { key: "designation", header: "Designação", render: (item) => item.designation },
      {
        key: "location",
        header: "Município/Província",
        render: (item) => [item.location.municipality, item.location.province].filter(Boolean).join(", ") || "—",
      },
      { key: "area", header: "Área (ha)", render: (item) => item.calculatedAreaHectares.toLocaleString("pt-AO") },
    ]}
    create={{
      label: "Nova área",
      dialogTitle: "Registar área",
      dialogDescription: "O polígono desenhado determina a área calculada e a localização — nunca a área declarada.",
      wide: true,
      initial: () => ({
        designation: "",
        boundary: [],
        declaredAreaHectares: 0,
        location: { province: "", municipality: "", commune: "" },
        igcaSketchFileReference: null,
        descriptiveMemoryFileReference: null,
        descriptiveMemoryText: null,
        legalSituation: "",
        priorInventoryFileReference: null,
        inventoryAuthorEntityId: null,
        landRegime: "Forest",
      }),
      submit: createForestArea,
      render: ({ value, setValue, errors }) => {
        const calculatedArea = polygonAreaHectares(value.boundary);
        const vegetationPercent = value.boundary.length >= 3 ? mockNaturalVegetationPercent(value.boundary) : null;
        const minVegetation = LAND_REGIME_MIN_VEGETATION[value.landRegime];
        const belowMinimum = vegetationPercent !== null && vegetationPercent < minVegetation;

        const handleBoundaryChange = (boundary: CoordinateDto[]) =>
          setValue((prev) => ({
            ...prev,
            boundary,
            location: boundary.length >= 3 ? { ...prev.location, province: deriveProvinceFromBoundary(boundary) } : prev.location,
          }));

        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="area-designation">Designação</Label>
              <Input
                id="area-designation"
                value={value.designation}
                onChange={(e) => setValue((prev) => ({ ...prev, designation: e.target.value }))}
              />
              {fieldError(errors, "designation") && <p className="text-sm text-destructive">{fieldError(errors, "designation")}</p>}
            </div>

            <PolygonBoundaryDrawer value={value.boundary} onChange={handleBoundaryChange} error={fieldError(errors, "boundary")} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area-declared">Área declarada (ha)</Label>
                <Input
                  id="area-declared"
                  type="number"
                  min={0}
                  value={value.declaredAreaHectares || ""}
                  onChange={(e) => setValue((prev) => ({ ...prev, declaredAreaHectares: Number(e.target.value) }))}
                />
                {fieldError(errors, "declaredAreaHectares") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "declaredAreaHectares")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Área calculada (ha)</Label>
                <Input readOnly disabled value={calculatedArea ? calculatedArea.toFixed(2) : "—"} />
                <p className="text-xs text-muted-foreground">
                  Derivada da geometria do polígono — é este valor, nunca o declarado, que determina a competência decisória.
                </p>
              </div>
            </div>

            <LocationFields
              value={value.location}
              onChange={(location) => setValue((prev) => ({ ...prev, location }))}
              errors={errors}
              lockProvince
            />

            <FileUploadField
              id="area-igca"
              label="Croquis IGCA"
              value={value.igcaSketchFileReference}
              onChange={(v) => setValue((prev) => ({ ...prev, igcaSketchFileReference: v }))}
              error={fieldError(errors, "igcaSketchFileReference")}
            />

            <FileUploadField
              id="area-prior-inventory"
              label="Inventário florestal anterior (opcional)"
              value={value.priorInventoryFileReference}
              onChange={(v) => setValue((prev) => ({ ...prev, priorInventoryFileReference: v, inventoryAuthorEntityId: v ? prev.inventoryAuthorEntityId : null }))}
            />

            {value.priorInventoryFileReference && (
              <EntityPicker
                id="area-inventory-author"
                label="Autor do inventário"
                queryKey={["idf", "picker", "recognized-entities", "inventory-author"]}
                load={() => loadRecognizedEntities("InventoryAuthor")}
                value={value.inventoryAuthorEntityId ?? ""}
                onChange={(v) => setValue((prev) => ({ ...prev, inventoryAuthorEntityId: v }))}
                emptyMessage="Sem entidades reconhecidas para inventário florestal."
                error={fieldError(errors, "inventoryAuthorEntityId")}
              />
            )}

            <FileUploadField
              id="area-memory-file"
              label={`Memória descritiva (upload)${value.priorInventoryFileReference ? " — opcional" : ""}`}
              value={value.descriptiveMemoryFileReference}
              onChange={(v) => setValue((prev) => ({ ...prev, descriptiveMemoryFileReference: v }))}
            />
            <div className="space-y-2">
              <Label htmlFor="area-memory-text">…ou descreva em texto</Label>
              <Textarea
                id="area-memory-text"
                value={value.descriptiveMemoryText ?? ""}
                onChange={(e) => setValue((prev) => ({ ...prev, descriptiveMemoryText: e.target.value }))}
              />
              {fieldError(errors, "descriptiveMemoryText") && (
                <p className="text-sm text-destructive">{fieldError(errors, "descriptiveMemoryText")}</p>
              )}
              {!value.priorInventoryFileReference && (
                <p className="text-xs text-muted-foreground">Obrigatória (ficheiro ou texto) — não há inventário florestal anterior anexado.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area-legal">Situação jurídica do terreno</Label>
              <Textarea
                id="area-legal"
                value={value.legalSituation}
                onChange={(e) => setValue((prev) => ({ ...prev, legalSituation: e.target.value }))}
              />
              {fieldError(errors, "legalSituation") && <p className="text-sm text-destructive">{fieldError(errors, "legalSituation")}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area-regime">Regime fundiário</Label>
                <Select
                  value={value.landRegime}
                  onValueChange={(v) => setValue((prev) => ({ ...prev, landRegime: v as LandRegime }))}
                >
                  <SelectTrigger id="area-regime">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LAND_REGIMES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>% de vegetação natural (mock)</Label>
                <Input readOnly disabled value={vegetationPercent === null ? "—" : `${vegetationPercent}% (mín. ${minVegetation}%)`} />
                {belowMinimum && <p className="text-sm text-destructive">Abaixo do mínimo legal para este regime.</p>}
              </div>
            </div>
          </>
        );
      },
    }}
    detail={(item) => (
      <div className="space-y-5">
        <PolygonBoundaryDrawer readOnly value={item.boundary} onChange={() => undefined} />

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Área declarada</dt>
            <dd className="font-medium">{item.declaredAreaHectares.toLocaleString("pt-AO")} ha</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Área calculada</dt>
            <dd className="font-medium">{item.calculatedAreaHectares.toLocaleString("pt-AO")} ha</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Localização</dt>
            <dd className="font-medium">{[item.location.municipality, item.location.province].filter(Boolean).join(", ") || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Regime fundiário</dt>
            <dd className="font-medium">{LAND_REGIMES.find((r) => r.value === item.landRegime)?.label}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Vegetação natural</dt>
            <dd className="font-medium">
              {item.naturalVegetationPercent}% (mínimo {LAND_REGIME_MIN_VEGETATION[item.landRegime]}%)
              {item.naturalVegetationPercent < LAND_REGIME_MIN_VEGETATION[item.landRegime] && (
                <span className="ml-2 text-destructive">Abaixo do mínimo</span>
              )}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Situação jurídica</dt>
            <dd className="font-medium">{item.legalSituation}</dd>
          </div>
        </dl>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-semibold">Sobreposição por camada</p>
          <div className="space-y-2">
            {item.overlapResults.map((r) => (
              <div key={r.layer} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{OVERLAP_LAYER_LABELS[r.layer]}</span>
                  <StatusBadge status={r.verdict} />
                </div>
                <p className="mt-1 text-muted-foreground">{r.note}</p>
                {r.overlappedHectares > 0 && <p className="text-xs text-muted-foreground">{r.overlappedHectares} ha sobrepostos</p>}
              </div>
            ))}
          </div>
        </div>

        <AreaConcessionsSection area={item} />
      </div>
    )}
  />
);

export default ForestAreasPage;
