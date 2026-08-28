import type { StyleSpecification } from "maplibre-gl";

/** Estilo base (OpenStreetMap raster) partilhado por todos os mapas do módulo IDF. */
export const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

/** Centro geográfico de Angola — usado como enquadramento inicial quando não há coordenada definida. */
export const ANGOLA_CENTER: [number, number] = [17.87, -11.2];
