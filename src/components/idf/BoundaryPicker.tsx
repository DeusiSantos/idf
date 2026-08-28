import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ANGOLA_CENTER, OSM_STYLE } from "@/lib/mapStyle";
import { POLYGON_VERTEX_COLORS, POLYGON_VERTEX_KEYS, hasPolygonArea, polygonCentroid, polygonRing } from "@/lib/polygon";
import type { CoordinateDto, PolygonDto } from "@/modules/idf/types";

interface BoundaryPickerProps {
  label?: string;
  value: PolygonDto;
  onChange: (value: PolygonDto) => void;
  error?: string;
  helper?: string;
}

const VERTEX_KEYS = POLYGON_VERTEX_KEYS;
const VERTEX_COLORS = POLYGON_VERTEX_COLORS;
const toRing = polygonRing;

const hasCoordinate = (value: CoordinateDto) => value.latitude !== 0 || value.longitude !== 0;
const round = (n: number) => Number(n.toFixed(6));

/** Gera um rectângulo ~1km à volta do ponto, útil como ponto de partida para ajustar. */
const rectangleAround = (center: [number, number]): PolygonDto => {
  const [lng, lat] = center;
  const d = 0.005;
  return {
    point1: { latitude: round(lat + d), longitude: round(lng - d) },
    point2: { latitude: round(lat + d), longitude: round(lng + d) },
    point3: { latitude: round(lat - d), longitude: round(lng + d) },
    point4: { latitude: round(lat - d), longitude: round(lng - d) },
  };
};

/** Selecção do polígono (4 vértices) que delimita a concessão — mapa com marcadores arrastáveis + introdução manual. */
export const BoundaryPicker = ({
  label = "Área da concessão",
  value,
  onChange,
  error,
  helper = "Arraste os 4 vértices coloridos para desenhar a área, ou introduza as coordenadas manualmente.",
}: BoundaryPickerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  onChangeRef.current = onChange;
  valueRef.current = value;

  const anyDefined = hasPolygonArea(value);

  useEffect(() => {
    if (!container.current || map.current) return;
    const centroid: [number, number] = anyDefined ? polygonCentroid(value) : ANGOLA_CENTER;

    const instance = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: centroid,
      zoom: anyDefined ? 13 : 5,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.current = instance;

    instance.on("load", () => {
      instance.addSource("boundary", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [toRing(valueRef.current)] } },
      });
      instance.addLayer({ id: "boundary-fill", type: "fill", source: "boundary", paint: { "fill-color": "#16a34a", "fill-opacity": 0.15 } });
      instance.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary",
        paint: { "line-color": "#16a34a", "line-width": 2 },
      });
    });

    markers.current = VERTEX_KEYS.map((key, index) => {
      const point = valueRef.current[key];
      const lngLat: [number, number] = hasCoordinate(point)
        ? [point.longitude, point.latitude]
        : [centroid[0] + (index % 2 === 0 ? -0.004 : 0.004), centroid[1] + (index < 2 ? 0.004 : -0.004)];

      const el = document.createElement("div");
      el.className =
        "flex h-7 w-7 cursor-move items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]";
      el.style.backgroundColor = VERTEX_COLORS[index];
      el.textContent = `P${index + 1}`;

      const m = new maplibregl.Marker({ element: el, draggable: true }).setLngLat(lngLat).addTo(instance);

      m.on("dragend", () => {
        const { lat, lng } = m.getLngLat();
        const next = { ...valueRef.current, [key]: { latitude: round(lat), longitude: round(lng) } };
        onChangeRef.current(next);
        const source = instance.getSource("boundary") as maplibregl.GeoJSONSource | undefined;
        source?.setData({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [toRing(next)] } });
      });

      return m;
    });

    return () => {
      instance.remove();
      map.current = null;
      markers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza marcadores e polígono quando o valor muda por fora (inputs manuais, GPS, rectângulo).
  useEffect(() => {
    if (!map.current) return;
    VERTEX_KEYS.forEach((key, index) => {
      const point = value[key];
      if (hasCoordinate(point)) markers.current[index]?.setLngLat([point.longitude, point.latitude]);
    });
    const source = map.current.getSource("boundary") as maplibregl.GeoJSONSource | undefined;
    source?.setData({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [toRing(value)] } });
  }, [value]);

  const setVertex = (key: (typeof VERTEX_KEYS)[number], patch: Partial<CoordinateDto>) =>
    onChange({ ...value, [key]: { ...value[key], ...patch } });

  const useGpsAsCenter = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const center: [number, number] = [round(position.coords.longitude), round(position.coords.latitude)];
      onChange(rectangleAround(center));
      map.current?.flyTo({ center, zoom: 13 });
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={useGpsAsCenter}>
          <Crosshair className="mr-2 h-3.5 w-3.5" />
          Gerar a partir do GPS
        </Button>
      </div>
      <div ref={container} className="h-64 w-full overflow-hidden rounded-lg border" />
      <div className="grid gap-2 sm:grid-cols-2">
        {VERTEX_KEYS.map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: VERTEX_COLORS[index] }}
              aria-hidden
            >
              P{index + 1}
            </span>
            <Input
              type="number"
              step="0.000001"
              placeholder={`Vértice ${index + 1} · Latitude`}
              value={Number.isFinite(value[key].latitude) ? value[key].latitude : ""}
              onChange={(e) => setVertex(key, { latitude: Number(e.target.value) })}
            />
            <Input
              type="number"
              step="0.000001"
              placeholder={`Vértice ${index + 1} · Longitude`}
              value={Number.isFinite(value[key].longitude) ? value[key].longitude : ""}
              onChange={(e) => setVertex(key, { longitude: Number(e.target.value) })}
            />
          </div>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Hexagon className="h-3 w-3" />
        {helper}
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default BoundaryPicker;
