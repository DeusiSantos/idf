import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, Eraser, Hexagon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ANGOLA_CENTER, OSM_STYLE } from "@/lib/mapStyle";
import { hasSelfIntersection, polygonBoundsFree, polygonCentroidFree, polygonRingFree } from "@/lib/geoPolygon";
import type { CoordinateDto } from "@/modules/idf/types";

export interface PolygonOverlay {
  points: CoordinateDto[];
  color: string;
  label?: string;
}

interface PolygonBoundaryDrawerProps {
  label?: string;
  value: CoordinateDto[];
  onChange: (value: CoordinateDto[]) => void;
  error?: string;
  helper?: string;
  /** Modo de visualização — esconde os controlos de edição (painel de detalhe da Área). */
  readOnly?: boolean;
  /** Polígono de referência a tracejado (ex.: limite da Área-mãe, para desenhar a parcela lá dentro). */
  referenceBoundary?: CoordinateDto[];
  /** Polígonos read-only extra, cada um com a sua cor (ex.: concessões já recortadas da Área). */
  overlayPolygons?: PolygonOverlay[];
}

const VERTEX_COLOR = "#16a34a";
const REFERENCE_COLOR = "#0ea5e9";
const round = (n: number) => Number(n.toFixed(6));

/**
 * Desenho de polígono de N vértices no mapa — generalização de `BoundaryPicker` (fixo a 4 vértices,
 * específico da Concessão) para o polígono livre da Área. Clique acrescenta vértice, arrastar
 * ajusta, "Remover último" desfaz, "Limpar" reinicia. Reutiliza `ANGOLA_CENTER`/`OSM_STYLE`.
 */
export const PolygonBoundaryDrawer = ({
  label = "Polígono da área",
  value,
  onChange,
  error,
  helper = "Clique no mapa para acrescentar vértices, ou arraste um vértice existente para ajustar.",
  readOnly = false,
  referenceBoundary,
  overlayPolygons,
}: PolygonBoundaryDrawerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const referenceMarkers = useRef<maplibregl.Marker[]>([]);
  // Fica `true` uma vez, quando as fontes/camadas ficam prontas (evento "load"). Não usar
  // `map.isStyleLoaded()` aqui: essa função só devolve `true` depois de TODOS os tiles do
  // mapa terminarem de carregar — o que fica `false` outra vez sempre que se dá um `fitBounds`/pan
  // para uma zona nova (novos tiles a pedir). Cliques a acrescentar vértices logo a seguir a
  // enquadrar a Área-mãe ficavam silenciosamente ignorados por causa disto.
  const ready = useRef(false);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const referenceBoundaryRef = useRef(referenceBoundary);
  const overlayPolygonsRef = useRef(overlayPolygons);
  onChangeRef.current = onChange;
  valueRef.current = value;
  referenceBoundaryRef.current = referenceBoundary;
  overlayPolygonsRef.current = overlayPolygons;

  const hasArea = value.length >= 3;
  const selfIntersects = value.length >= 4 && hasSelfIntersection(value);

  const drawPolygon = (instance: maplibregl.Map) => {
    const points = valueRef.current;
    const data: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: points.length >= 3 ? { type: "Polygon", coordinates: [polygonRingFree(points)] } : { type: "LineString", coordinates: points.map((p) => [p.longitude, p.latitude]) },
    };
    const source = instance.getSource("area-boundary") as maplibregl.GeoJSONSource | undefined;
    source?.setData(data);

    // Linha (tracejada) a ligar o último vértice de volta ao primeiro — mostra sempre onde o
    // polígono fecha, mesmo enquanto ainda só há 2 pontos (com 3+ o preenchimento já fecha
    // sozinho, mas a linha extra ajuda a perceber isso claramente).
    const closingSource = instance.getSource("closing-line") as maplibregl.GeoJSONSource | undefined;
    closingSource?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates:
          points.length >= 2
            ? [
                [points[points.length - 1].longitude, points[points.length - 1].latitude],
                [points[0].longitude, points[0].latitude],
              ]
            : [],
      },
    });
  };

  const drawReferenceBoundary = (instance: maplibregl.Map) => {
    const source = instance.getSource("reference-boundary") as maplibregl.GeoJSONSource | undefined;
    const points = referenceBoundaryRef.current ?? [];
    source?.setData({
      type: "Feature",
      properties: {},
      geometry: points.length >= 3 ? { type: "Polygon", coordinates: [polygonRingFree(points)] } : { type: "LineString", coordinates: [] },
    });

    // Vértices da Área-mãe, bem visíveis (numerados, cor de referência) — só a linha tracejada
    // não dava para perceber onde estavam os cantos do polígono. `pointer-events: none` é
    // essencial aqui: são só decorativos, e ficam exactamente onde é mais natural clicar para
    // desenhar a parcela (perto dos limites da Área) — sem isto, bloqueavam os cliques da parcela.
    referenceMarkers.current.forEach((m) => m.remove());
    referenceMarkers.current = points.map((point, index) => {
      const el = document.createElement("div");
      el.className =
        "flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white opacity-90 shadow-[0_2px_6px_rgba(0,0,0,0.35)]";
      el.style.backgroundColor = REFERENCE_COLOR;
      el.style.pointerEvents = "none";
      el.textContent = `${index + 1}`;
      return new maplibregl.Marker({ element: el }).setLngLat([point.longitude, point.latitude]).addTo(instance);
    });
  };

  const drawOverlayPolygons = (instance: maplibregl.Map) => {
    const source = instance.getSource("overlay-polygons") as maplibregl.GeoJSONSource | undefined;
    const overlays = overlayPolygonsRef.current ?? [];
    source?.setData({
      type: "FeatureCollection",
      features: overlays
        .filter((o) => o.points.length >= 3)
        .map((o) => ({
          type: "Feature" as const,
          properties: { color: o.color, label: o.label ?? "" },
          geometry: { type: "Polygon" as const, coordinates: [polygonRingFree(o.points)] },
        })),
    });
  };

  const rebuildMarkers = (instance: maplibregl.Map) => {
    markers.current.forEach((m) => m.remove());
    markers.current = valueRef.current.map((point, index) => {
      const el = document.createElement("div");
      el.className =
        "flex h-6 w-6 cursor-move items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]";
      el.style.backgroundColor = VERTEX_COLOR;
      el.textContent = `${index + 1}`;

      const marker = new maplibregl.Marker({ element: el, draggable: !readOnly }).setLngLat([point.longitude, point.latitude]).addTo(instance);

      if (!readOnly) {
        marker.on("dragend", () => {
          const { lat, lng } = marker.getLngLat();
          const next = valueRef.current.map((p, i) => (i === index ? { latitude: round(lat), longitude: round(lng) } : p));
          onChangeRef.current(next);
        });
      }
      return marker;
    });
  };

  // Inicializa o mapa uma única vez. Sem parcela própria ainda, enquadra logo a Área-mãe (se
  // houver `referenceBoundary`) em vez de abrir a mostrar Angola inteira — era por isto que os
  // vértices da Área pareciam "não aparecer": estavam lá, só que fora do enquadramento inicial.
  useEffect(() => {
    if (!container.current || map.current) return;
    const referencePoints = referenceBoundaryRef.current ?? [];
    const hasReference = referencePoints.length >= 3;
    const center: [number, number] = hasArea ? polygonCentroidFree(value) : hasReference ? polygonCentroidFree(referencePoints) : ANGOLA_CENTER;

    const instance = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center,
      zoom: hasArea ? 12 : hasReference ? 12 : 5,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.current = instance;

    // O mapa nasce quase sempre dentro de um Dialog a meio da animação de abertura — o
    // contentor pode ainda não ter o tamanho final nesse instante, o que faz o maplibre calcular
    // mal a posição dos marcadores (ficam invisíveis/fora do sítio). `ResizeObserver` corrige
    // assim que o Dialog assenta; o `requestAnimationFrame` cobre o primeiro frame antes disso.
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(container.current);
    requestAnimationFrame(() => instance.resize());

    instance.on("load", () => {
      instance.addSource("reference-boundary", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } } });
      instance.addLayer({
        id: "reference-boundary-line",
        type: "line",
        source: "reference-boundary",
        paint: { "line-color": REFERENCE_COLOR, "line-width": 2, "line-dasharray": [2, 2] },
      });

      instance.addSource("overlay-polygons", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      instance.addLayer({ id: "overlay-fill", type: "fill", source: "overlay-polygons", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.25 } });
      instance.addLayer({ id: "overlay-line", type: "line", source: "overlay-polygons", paint: { "line-color": ["get", "color"], "line-width": 2 } });

      instance.addSource("area-boundary", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } } });
      instance.addLayer({ id: "area-boundary-fill", type: "fill", source: "area-boundary", paint: { "fill-color": VERTEX_COLOR, "fill-opacity": 0.15 } });
      instance.addLayer({ id: "area-boundary-line", type: "line", source: "area-boundary", paint: { "line-color": VERTEX_COLOR, "line-width": 2 } });

      instance.addSource("closing-line", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } } });
      instance.addLayer({ id: "closing-line", type: "line", source: "closing-line", paint: { "line-color": VERTEX_COLOR, "line-width": 2, "line-dasharray": [2, 2] } });

      drawReferenceBoundary(instance);
      drawOverlayPolygons(instance);
      rebuildMarkers(instance);
      drawPolygon(instance);

      // Enquadra o polígono da Área-mãe com precisão (não só o centro) quando ainda não há parcela própria.
      if (!hasArea && hasReference) {
        instance.fitBounds(polygonBoundsFree(referencePoints), { padding: 48, duration: 0, maxZoom: 15 });
      }

      ready.current = true;
    });

    if (!readOnly) {
      instance.on("click", (e) => {
        onChangeRef.current([...valueRef.current, { latitude: round(e.lngLat.lat), longitude: round(e.lngLat.lng) }]);
      });
    }

    return () => {
      resizeObserver.disconnect();
      instance.remove();
      map.current = null;
      markers.current = [];
      referenceMarkers.current = [];
      ready.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconstrói marcadores + polígono sempre que o número de vértices muda (o arrastar já actualiza sem recriar).
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready.current) return;
    rebuildMarkers(instance);
    drawPolygon(instance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready.current) return;
    drawReferenceBoundary(instance);
  }, [referenceBoundary]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready.current) return;
    drawOverlayPolygons(instance);
  }, [overlayPolygons]);

  const addAtGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const point = { latitude: round(position.coords.latitude), longitude: round(position.coords.longitude) };
      onChange([...value, point]);
      map.current?.flyTo({ center: [point.longitude, point.latitude], zoom: 14 });
    });
  };

  const removeLast = () => onChange(value.slice(0, -1));
  const clear = () => onChange([]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {!readOnly && (
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addAtGps}>
              <Crosshair className="mr-2 h-3.5 w-3.5" />
              Adicionar no GPS
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={value.length === 0} onClick={removeLast}>
              <Undo2 className="mr-2 h-3.5 w-3.5" />
              Remover último
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={value.length === 0} onClick={clear}>
              <Eraser className="mr-2 h-3.5 w-3.5" />
              Limpar
            </Button>
          </div>
        )}
      </div>
      <div ref={container} className="h-72 w-full overflow-hidden rounded-lg border" />
      {!readOnly && value.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {value.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: VERTEX_COLOR }}
                aria-hidden
              >
                {index + 1}
              </span>
              <Input
                type="number"
                step="0.000001"
                placeholder={`Vértice ${index + 1} · Latitude`}
                value={point.latitude}
                onChange={(e) => onChange(value.map((p, i) => (i === index ? { ...p, latitude: Number(e.target.value) } : p)))}
              />
              <Input
                type="number"
                step="0.000001"
                placeholder={`Vértice ${index + 1} · Longitude`}
                value={point.longitude}
                onChange={(e) => onChange(value.map((p, i) => (i === index ? { ...p, longitude: Number(e.target.value) } : p)))}
              />
            </div>
          ))}
        </div>
      )}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Hexagon className="h-3 w-3" />
        {readOnly ? `Polígono com ${value.length} vértice(s).` : helper}
      </p>
      {selfIntersects && <p className="text-sm text-destructive">O polígono tem auto-intersecção — ajuste os vértices.</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default PolygonBoundaryDrawer;
