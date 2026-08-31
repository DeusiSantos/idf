import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ANGOLA_CENTER, OSM_STYLE } from "@/lib/mapStyle";
import { POLYGON_VERTEX_COLORS, POLYGON_VERTEX_KEYS, hasPolygonArea, polygonBounds, polygonCentroid, polygonRing } from "@/lib/polygon";
import type { CoordinateDto, PolygonDto } from "@/modules/idf/types";

interface CoordinatePickerProps {
  label?: string;
  value: CoordinateDto;
  onChange: (value: CoordinateDto) => void;
  error?: string;
  helper?: string;
  /** Polígono de referência (ex.: limite da concessão) desenhado a tracejado, só para orientação — não editável aqui. */
  boundary?: PolygonDto | null;
}

const hasCoordinate = (value: CoordinateDto) => value.latitude !== 0 || value.longitude !== 0;

const round = (n: number) => Number(n.toFixed(6));

const BOUNDARY_COLOR = "#0ea5e9";

/** Selecção de coordenadas por mapa (clique/arrastar marcador), GPS ou introdução manual. */
export const CoordinatePicker = ({
  label = "Coordenadas",
  value,
  onChange,
  error,
  helper = "Clique no mapa ou arraste o marcador para ajustar. Também pode introduzir manualmente.",
  boundary,
}: CoordinatePickerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const boundaryMarkers = useRef<maplibregl.Marker[]>([]);
  const onChangeRef = useRef(onChange);
  const boundaryRef = useRef(boundary);
  // `map.isStyleLoaded()` só fica `true` depois de todos os tiles do mapa terminarem de carregar
  // (fica `false` de novo a cada `fitBounds`/pan) — não serve para decidir se já se pode
  // adicionar a fonte/camada da referência. `ready` fica `true` uma vez, no evento "load".
  const ready = useRef(false);
  onChangeRef.current = onChange;
  boundaryRef.current = boundary;

  const showsBoundary = Boolean(boundary && hasPolygonArea(boundary));

  const drawBoundary = (instance: maplibregl.Map, polygon: PolygonDto) => {
    boundaryMarkers.current.forEach((m) => m.remove());
    boundaryMarkers.current = POLYGON_VERTEX_KEYS.map((key, index) => {
      const el = document.createElement("div");
      el.className =
        "flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white opacity-90 shadow";
      el.style.backgroundColor = POLYGON_VERTEX_COLORS[index];
      el.style.pointerEvents = "none"; // decorativo — não pode bloquear o clique para colocar a coordenada
      el.textContent = `P${index + 1}`;
      const point = polygon[key];
      return new maplibregl.Marker({ element: el }).setLngLat([point.longitude, point.latitude]).addTo(instance);
    });

    const data: GeoJSON.Feature = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [polygonRing(polygon)] } };
    const source = instance.getSource("reference-boundary") as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(data);
    } else {
      instance.addSource("reference-boundary", { type: "geojson", data });
      instance.addLayer({
        id: "reference-boundary-fill",
        type: "fill",
        source: "reference-boundary",
        paint: { "fill-color": BOUNDARY_COLOR, "fill-opacity": 0.08 },
      });
      instance.addLayer({
        id: "reference-boundary-line",
        type: "line",
        source: "reference-boundary",
        paint: { "line-color": BOUNDARY_COLOR, "line-width": 2, "line-dasharray": [2, 2] },
      });
    }
  };

  // Inicializa o mapa uma única vez.
  useEffect(() => {
    if (!container.current || map.current) return;
    const boundaryHasArea = boundaryRef.current && hasPolygonArea(boundaryRef.current);
    const initialCenter: [number, number] = hasCoordinate(value)
      ? [value.longitude, value.latitude]
      : boundaryHasArea
        ? polygonCentroid(boundaryRef.current!)
        : ANGOLA_CENTER;

    const instance = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: initialCenter,
      zoom: hasCoordinate(value) ? 12 : boundaryHasArea ? 13 : 5,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.current = instance;

    // Corrige o mapa nascer com o contentor ainda sem o tamanho final (dentro de um Dialog a
    // meio da animação) — sem isto o marcador fica mal posicionado/invisível.
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(container.current);
    requestAnimationFrame(() => instance.resize());

    const m = new maplibregl.Marker({ draggable: true, color: "#16a34a" }).setLngLat(initialCenter);
    if (hasCoordinate(value)) m.addTo(instance);
    marker.current = m;

    const placeAt = (lngLat: maplibregl.LngLat) => {
      m.setLngLat(lngLat).addTo(instance);
      onChangeRef.current({ latitude: round(lngLat.lat), longitude: round(lngLat.lng) });
    };

    instance.on("click", (e) => placeAt(e.lngLat));
    m.on("dragend", () => placeAt(m.getLngLat()));

    instance.on("load", () => {
      if (boundaryRef.current && hasPolygonArea(boundaryRef.current)) drawBoundary(instance, boundaryRef.current);
      if (boundaryHasArea && !hasCoordinate(value)) {
        instance.fitBounds(polygonBounds(boundaryRef.current!), { padding: 48, duration: 0, maxZoom: 15 });
      }
      ready.current = true;
    });

    return () => {
      resizeObserver.disconnect();
      instance.remove();
      map.current = null;
      marker.current = null;
      boundaryMarkers.current = [];
      ready.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza o marcador quando o valor muda por fora (inputs manuais, GPS).
  useEffect(() => {
    if (!marker.current || !map.current) return;
    if (hasCoordinate(value)) {
      marker.current.setLngLat([value.longitude, value.latitude]).addTo(map.current);
    }
  }, [value.latitude, value.longitude]);

  // Desenha/actualiza o polígono de referência quando chega ou muda (ex.: concessão carregada de forma assíncrona).
  useEffect(() => {
    const instance = map.current;
    if (!instance || !boundary || !hasPolygonArea(boundary)) return;
    if (ready.current) drawBoundary(instance, boundary);
    else instance.once("load", () => drawBoundary(instance, boundary));
  }, [boundary]);

  const capture = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const next = { latitude: round(position.coords.latitude), longitude: round(position.coords.longitude) };
      onChange(next);
      map.current?.flyTo({ center: [next.longitude, next.latitude], zoom: 14 });
    });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div ref={container} className="h-56 w-full overflow-hidden rounded-lg border" />
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          type="number"
          step="0.000001"
          placeholder="Latitude"
          value={Number.isFinite(value.latitude) ? value.latitude : ""}
          onChange={(e) => onChange({ ...value, latitude: Number(e.target.value) })}
        />
        <Input
          type="number"
          step="0.000001"
          placeholder="Longitude"
          value={Number.isFinite(value.longitude) ? value.longitude : ""}
          onChange={(e) => onChange({ ...value, longitude: Number(e.target.value) })}
        />
        <Button type="button" variant="outline" onClick={capture}>
          <Crosshair className="mr-2 h-4 w-4" />
          GPS
        </Button>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {helper}
      </p>
      {showsBoundary && (
        <p className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
          <span className="h-2 w-2 shrink-0 rounded-full border border-dashed" style={{ borderColor: BOUNDARY_COLOR }} aria-hidden />
          A área a tracejado (P1–P4) é o limite da concessão — a coordenada deve ficar dentro dela.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default CoordinatePicker;
