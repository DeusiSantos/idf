import { useEffect, useRef, useState } from "react";
import { ComboboxInput } from "@/components/idf/ComboboxInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { type AngolaLocation, fetchComunasPorMunicipio, fetchMunicipiosPorProvincia, fetchProvincias } from "@/lib/angolaApi";

export interface LocationValue {
  province: string;
  municipality: string;
  commune: string;
}

interface LocationFieldsProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  errors?: Record<string, string[]>;
  /** Prefixo dos nomes de campo no ProblemDetails (por omissão "location", ex. "location.province"). */
  errorPrefix?: string;
}

const normalize = (value: string) => value.trim().toLowerCase();

/**
 * Selector em cascata Província → Município → Comuna (Angola), via API pública
 * angolaprovinciasapi.ggwp.com.br. Província é lista fechada; Município/Comuna aceitam texto
 * livre com sugestões, porque a cobertura da API é incompleta — uma falha de rede nunca bloqueia
 * o preenchimento do formulário.
 */
export const LocationFields = ({ value, onChange, errors, errorPrefix = "location" }: LocationFieldsProps) => {
  const { toast } = useToast();
  const [provincias, setProvincias] = useState<AngolaLocation[]>([]);
  const [municipios, setMunicipios] = useState<AngolaLocation[]>([]);
  const [comunas, setComunas] = useState<AngolaLocation[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [loadingComunas, setLoadingComunas] = useState(false);
  const [provinciaSlug, setProvinciaSlug] = useState("");

  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const isFirstProvinciaRun = useRef(true);

  // 1) Províncias — carregadas uma única vez.
  useEffect(() => {
    let cancelled = false;
    setLoadingProvincias(true);
    fetchProvincias()
      .then((data) => {
        if (!cancelled) setProvincias(data);
      })
      .catch(() => {
        if (!cancelled) toast({ variant: "destructive", title: "Não foi possível carregar as províncias." });
      })
      .finally(() => {
        if (!cancelled) setLoadingProvincias(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve o slug inicial a partir do nome já preenchido (edição de um registo existente).
  useEffect(() => {
    if (!value.province || provinciaSlug) return;
    const match = provincias.find((p) => normalize(p.nome) === normalize(value.province));
    if (match) setProvinciaSlug(match.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provincias]);

  // 2) Ao mudar a província, recarrega municípios; limpa município/comuna excepto no primeiro run.
  useEffect(() => {
    if (!provinciaSlug) {
      setMunicipios([]);
      return;
    }
    const shouldClear = !isFirstProvinciaRun.current;
    isFirstProvinciaRun.current = false;
    if (shouldClear) {
      onChangeRef.current({ ...valueRef.current, municipality: "", commune: "" });
      setComunas([]);
    }
    let cancelled = false;
    setLoadingMunicipios(true);
    fetchMunicipiosPorProvincia(provinciaSlug)
      .then((data) => {
        if (!cancelled) setMunicipios(data);
      })
      .catch(() => {
        if (!cancelled) toast({ variant: "destructive", title: "Não foi possível carregar sugestões de município." });
      })
      .finally(() => {
        if (!cancelled) setLoadingMunicipios(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinciaSlug]);

  // 3) Quando o texto do município corresponde a uma sugestão conhecida, recarrega comunas.
  useEffect(() => {
    const match = municipios.find((m) => normalize(m.nome) === normalize(value.municipality));
    if (!match) {
      setComunas([]);
      return;
    }
    let cancelled = false;
    setLoadingComunas(true);
    fetchComunasPorMunicipio(match.slug)
      .then((data) => {
        if (!cancelled) setComunas(data);
      })
      .catch(() => {
        // Município sem comunas cobertas pela API — segue como texto livre, sem erro visível.
      })
      .finally(() => {
        if (!cancelled) setLoadingComunas(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.municipality, municipios]);

  const handleProvinciaChange = (slug: string) => {
    setProvinciaSlug(slug);
    const nome = provincias.find((p) => p.slug === slug)?.nome ?? "";
    onChange({ ...value, province: nome });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="loc-provincia">Província</Label>
        <Select value={provinciaSlug} onValueChange={handleProvinciaChange} disabled={loadingProvincias}>
          <SelectTrigger id="loc-provincia">
            <SelectValue placeholder="Seleccione a província" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldError(errors, `${errorPrefix}.province`) && (
          <p className="text-sm text-destructive">{fieldError(errors, `${errorPrefix}.province`)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Município</Label>
        <ComboboxInput
          value={value.municipality}
          onChange={(municipality) => onChange({ ...value, municipality })}
          options={municipios.map((m) => m.nome)}
          placeholder={provinciaSlug ? "Escreva ou seleccione" : "Escolha a província primeiro"}
          disabled={!provinciaSlug}
          loading={loadingMunicipios}
        />
        {fieldError(errors, `${errorPrefix}.municipality`) && (
          <p className="text-sm text-destructive">{fieldError(errors, `${errorPrefix}.municipality`)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Comuna</Label>
        <ComboboxInput
          value={value.commune}
          onChange={(commune) => onChange({ ...value, commune })}
          options={comunas.map((c) => c.nome)}
          placeholder="Escreva ou seleccione"
          loading={loadingComunas}
        />
        {fieldError(errors, `${errorPrefix}.commune`) && (
          <p className="text-sm text-destructive">{fieldError(errors, `${errorPrefix}.commune`)}</p>
        )}
      </div>
    </div>
  );
};

export default LocationFields;
