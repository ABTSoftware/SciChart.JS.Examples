import poly2tri from "poly2tri";

interface GeoJsonFeature {
    properties: { STATE_NAME: string };
    geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: number[][][][] | number[][][];
    };
}

export interface ConvertedState {
    name: string;
    outline: number[][];
    areaData: number[][];
}

function triangulateRing(ring: number[][]): number[][] | null {
    let pts = ring;

    // Remove closing point if duplicate
    if (pts.length > 1) {
        const first = pts[0];
        const last = pts[pts.length - 1];
        if (first[0] === last[0] && first[1] === last[1]) {
            pts = pts.slice(0, -1);
        }
    }

    if (pts.length < 3) return null;

    // Deduplicate — poly2tri throws on duplicate points
    const seen = new Set<string>();
    pts = pts.filter((p) => {
        const key = `${p[0]},${p[1]}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (pts.length < 3) return null;

    try {
        const contour = pts.map((p) => new poly2tri.Point(p[0], p[1]));
        const swctx = new poly2tri.SweepContext(contour);
        swctx.triangulate();
        const triangles = swctx.getTriangles();
        const result: number[][] = [];
        for (const t of triangles) {
            const p0 = t.getPoint(0);
            const p1 = t.getPoint(1);
            const p2 = t.getPoint(2);
            result.push([p0.x, p0.y], [p1.x, p1.y], [p2.x, p2.y]);
        }
        return result.length > 0 ? result : null;
    } catch {
        return null;
    }
}

export function convertGeoJson(geojson: { features: GeoJsonFeature[] }): ConvertedState[] {
    const result: ConvertedState[] = [];

    for (const feature of geojson.features) {
        const name = feature.properties.STATE_NAME;
        const geom = feature.geometry;

        const polygons: number[][][][] =
            geom.type === "MultiPolygon"
                ? (geom.coordinates as number[][][][])
                : [(geom.coordinates as number[][][])];

        for (const polygon of polygons) {
            const outerRing = polygon[0];
            const areaData = triangulateRing(outerRing);
            if (!areaData) continue;

            // Outline without closing point
            let outline = outerRing;
            if (outline.length > 1) {
                const first = outline[0];
                const last = outline[outline.length - 1];
                if (first[0] === last[0] && first[1] === last[1]) {
                    outline = outline.slice(0, -1);
                }
            }

            result.push({ name, outline, areaData });
        }
    }

    return result;
}
