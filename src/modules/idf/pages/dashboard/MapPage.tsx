import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Compass, Loader2, Map as MapIcon, Search, Trees, Warehouse } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getMapPoints, type MapPoint, type MapPointKind } from "@/modules/idf/api/dashboard";
import { ANGOLA_CENTER, OSM_STYLE } from "@/lib/mapStyle";
import { hasPolygonArea, polygonRing } from "@/lib/polygon";
import { cn } from "@/lib/utils";

const BOUNDARY_SOURCE_ID = "concession-boundaries";
const BOUNDARY_COLOR = "#16a34a";

/** FeatureCollection dos polígonos das concessões visíveis — reutilizado tanto no "load" do mapa como ao actualizar pontos. */
const boundaryFeatureCollection = (points: MapPoint[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: points
    .filter((p) => p.kind === "concession" && p.boundary && hasPolygonArea(p.boundary))
    .map((p) => ({
      type: "Feature",
      properties: { id: p.id },
      geometry: { type: "Polygon", coordinates: [polygonRing(p.boundary!)] },
    })),
});

/**
 * Cria (uma vez) ou actualiza a fonte/camadas do polígono das concessões. Chamado tanto no "load"
 * do mapa como sempre que os pontos mudam — se o estilo ainda não estiver pronto nessa segunda
 * chamada, agenda-se para o próprio "load" em vez de falhar silenciosamente (a causa mais provável
 * de "só aparece o ponto, não a área": os dados chegam antes do mapa acabar de carregar o estilo).
 */
const syncBoundaryLayer = (instance: maplibregl.Map, points: MapPoint[]) => {
  const data = boundaryFeatureCollection(points);
  const source = instance.getSource(BOUNDARY_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
    return;
  }
  if (!instance.isStyleLoaded()) {
    instance.once("load", () => syncBoundaryLayer(instance, points));
    return;
  }
  instance.addSource(BOUNDARY_SOURCE_ID, { type: "geojson", data });
  instance.addLayer({
    id: `${BOUNDARY_SOURCE_ID}-fill`,
    type: "fill",
    source: BOUNDARY_SOURCE_ID,
    paint: { "fill-color": BOUNDARY_COLOR, "fill-opacity": 0.18 },
  });
  instance.addLayer({
    id: `${BOUNDARY_SOURCE_ID}-line`,
    type: "line",
    source: BOUNDARY_SOURCE_ID,
    paint: { "line-color": BOUNDARY_COLOR, "line-width": 2 },
  });
};

const KINDS: { kind: MapPointKind; label: string; icon: typeof MapIcon; tone: string; dot: string }[] = [
  { kind: "concession", label: "Concessões", icon: MapIcon, tone: "bg-primary", dot: "bg-primary" },
  { kind: "warehouse", label: "Entrepostos", icon: Warehouse, tone: "bg-destructive", dot: "bg-destructive" },
  { kind: "inventory", label: "Inventários", icon: Trees, tone: "bg-accent", dot: "bg-accent" },
  { kind: "inspection", label: "Inspecções", icon: Search, tone: "bg-info", dot: "bg-info" },
];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const MapPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ["idf", "map-points"], queryFn: getMapPoints });
  const [active, setActive] = useState<MapPointKind[]>(KINDS.map((k) => k.kind));
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersById = useRef<Map<string, maplibregl.Marker>>(new Map());

  const points = useMemo(() => (data ?? []).filter((p) => active.includes(p.kind)), [data, active]);
  const visiblePoints = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return points;
    return points.filter((p) => p.title.toLowerCase().includes(term) || p.subtitle.toLowerCase().includes(term));
  }, [points, search]);

  const toggleKind = (kind: MapPointKind) =>
    setActive((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));

  useEffect(() => {
    if (!container.current || map.current) return;
    map.current = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: ANGOLA_CENTER,
      zoom: 4.6,
      attributionControl: { compact: true },
    });
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.current.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Marcadores — recriados só quando o conjunto de pontos visíveis muda (não em cada selecção).
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    markersById.current.forEach((m) => m.remove());
    markersById.current.clear();

    syncBoundaryLayer(instance, points);

    points.forEach((point) => {
      const tone = KINDS.find((k) => k.kind === point.kind)?.tone ?? "bg-primary";
      const el = document.createElement("button");
      el.setAttribute("aria-label", point.title);
      el.className = "idf-marker group relative flex h-8 w-8 -translate-y-1 cursor-pointer items-center justify-center";
      el.innerHTML = `
        <span class="absolute inset-0 rounded-full ${tone} opacity-0 blur-md transition-opacity duration-300 group-[.is-selected]:opacity-60"></span>
        <span class="relative flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-white ${tone} shadow-[0_2px_8px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-transform duration-200 ease-out group-hover:scale-125 group-[.is-selected]:scale-125">
          <span class="h-2 w-2 rounded-full bg-white/95"></span>
        </span>
      `;
      el.addEventListener("click", () => setSelected(point));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.coordinate.longitude, point.coordinate.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 18, closeButton: false, className: "idf-popup" }).setHTML(
            `<div class="min-w-[170px]">
               <p class="font-display text-[13px] font-bold leading-snug text-foreground">${escapeHtml(point.title)}</p>
               <p class="mt-0.5 text-xs text-muted-foreground">${escapeHtml(point.subtitle)}</p>
             </div>`,
          ),
        )
        .addTo(instance);
      markersById.current.set(point.id, marker);
    });

    if (points.length) {
      const bounds = points.reduce((acc, p) => {
        acc.extend([p.coordinate.longitude, p.coordinate.latitude]);
        if (p.boundary && hasPolygonArea(p.boundary)) polygonRing(p.boundary).forEach((vertex) => acc.extend(vertex));
        return acc;
      }, new maplibregl.LngLatBounds([points[0].coordinate.longitude, points[0].coordinate.latitude], [points[0].coordinate.longitude, points[0].coordinate.latitude]));
      instance.fitBounds(bounds, { padding: 90, maxZoom: 11, duration: 600 });
    }
  }, [points]);

  // Destaque do marcador seleccionado — não mexe nos outros nem refaz o enquadramento.
  useEffect(() => {
    markersById.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("is-selected", id === selected?.id);
    });
  }, [selected]);

  const focus = (point: MapPoint) => {
    setSelected(point);
    map.current?.flyTo({ center: [point.coordinate.longitude, point.coordinate.latitude], zoom: 12, duration: 800 });
  };

  const recenter = () => {
    setSelected(null);
    map.current?.flyTo({ center: ANGOLA_CENTER, zoom: 4.6, duration: 800 });
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] min-h-[560px] flex-col gap-4">
      <PageHeader
        title="Mapa das explorações"
        crumbs={[{ label: "Dashboard", to: "/idf/dashboard" }, { label: "Mapa" }]}
        description="Georreferenciação de concessões, entrepostos, inventários e inspecções em todo o território nacional."
      />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border/70 shadow-md">
          <div ref={container} className="h-full w-full" />

          {/* Controlo de camadas — flutuante, estilo "glass", sobre o próprio mapa. */}
          <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
            {KINDS.map(({ kind, label, icon: Icon, dot }) => {
              const count = (data ?? []).filter((p) => p.kind === kind).length;
              const isActive = active.includes(kind);
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => toggleKind(kind)}
                  className={cn(
                    "pointer-events-auto flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md transition-all duration-150",
                    isActive
                      ? "border-border bg-card/90 text-foreground"
                      : "border-border/50 bg-card/50 text-muted-foreground opacity-70 hover:opacity-100",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full transition-opacity", dot, !isActive && "opacity-40")} />
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] tabular-nums",
                      isActive ? "bg-muted text-muted-foreground" : "bg-transparent",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {isLoading && (
              <span className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                A carregar…
              </span>
            )}
          </div>

          {/* Recentrar em Angola — flutuante, canto inferior direito, acima dos controlos nativos. */}
          <button
            type="button"
            onClick={recenter}
            aria-label="Recentrar mapa em Angola"
            title="Recentrar em Angola"
            className="absolute bottom-[6.5rem] right-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Compass className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-col rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="shrink-0 space-y-2 border-b border-border p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Pontos no mapa</p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {visiblePoints.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar por nome…"
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2.5">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            {!isLoading && visiblePoints.length === 0 && (
              <p className="px-2 py-10 text-center text-sm text-muted-foreground">
                Nenhum ponto georreferenciado nesta selecção.
              </p>
            )}
            {visiblePoints.map((point) => {
              const kindMeta = KINDS.find((k) => k.kind === point.kind);
              const Icon = kindMeta?.icon ?? MapIcon;
              const isSelected = selected?.id === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => focus(point)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-xl border border-transparent p-2.5 text-left transition-colors",
                    isSelected ? "border-primary/30 bg-primary/5" : "hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
                      kindMeta?.tone ?? "bg-primary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{point.title}</span>
                      <StatusBadge status={point.status} className="shrink-0" />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{point.subtitle}</p>
                    <p className="mt-1 font-mono text-[10.5px] text-muted-foreground/70">
                      {point.coordinate.latitude.toFixed(4)}, {point.coordinate.longitude.toFixed(4)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
