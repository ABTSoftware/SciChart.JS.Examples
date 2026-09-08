import type { NumberArray } from "scichart";

/**
 * A single traced contour polyline.
 * @remarks
 * Points are expressed in *fractional grid-index space*, i.e. `i` indexes the heatmap columns and
 * `j` the rows of the `zValues` array, with fractional parts where the contour crosses between
 * two samples. The caller is responsible for mapping indices to data or pixel coordinates.
 */
export type TContourPolyline = {
    /** The z level this polyline was traced at */
    level: number;
    /** Flat `[i0, j0, i1, j1, ...]` fractional grid indices */
    points: number[];
    /** True when the last point coincides with the first, i.e. the polyline is a closed loop */
    isClosed: boolean;
};

/** Per-level accumulator used while marching over the cells. @ignore */
type TLevelBuffer = {
    level: number;
    /** Flat pairs of edge ids, two per segment */
    segEdges: number[];
    /** edge id -> first segment touching it */
    segA: Map<number, number>;
    /** edge id -> second segment touching it. An edge is touched by at most two segments */
    segB: Map<number, number>;
    /** Flat `[i, j, i, j, ...]` crossing points, one per edge that the contour crosses */
    coords: number[];
    /** edge id -> offset of its crossing point in {@link coords} */
    edgeCoord: Map<number, number>;
};

/**
 * Builds the list of sample indices covering `[0, end]` with the given stride.
 * `end` is always included so the traced region covers the full requested window.
 * @ignore
 */
const buildSampleIndices = (end: number, stride: number): number[] => {
    const indices: number[] = [];
    for (let i = 0; i < end; i += stride) {
        indices.push(i);
    }
    indices.push(end);
    return indices;
};

/** Index of the first entry of the sorted array which is >= value. @ignore */
const lowerBound = (sorted: number[], value: number): number => {
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (sorted[mid] < value) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
};

/**
 * Interpolates and memoises the contour's crossing point on one edge of a cell. Neighbouring cells
 * derive the same edge id and so reuse the vertex exactly, which is what lets the segments stitch
 * without any tolerance matching.
 * @ignore
 */
const addEdgePoint = (
    buffer: TLevelBuffer,
    edge: number,
    level: number,
    valueFrom: number,
    valueTo: number,
    iFrom: number,
    jFrom: number,
    iTo: number,
    jTo: number
): number => {
    if (!buffer.edgeCoord.has(edge)) {
        const t = (level - valueFrom) / (valueTo - valueFrom);
        buffer.edgeCoord.set(edge, buffer.coords.length);
        buffer.coords.push(iFrom + t * (iTo - iFrom), jFrom + t * (jTo - jFrom));
    }
    return edge;
};

/** Registers a segment between two edges of the current cell. @ignore */
const addSegment = (buffer: TLevelBuffer, edge0: number, edge1: number) => {
    const segIndex = buffer.segEdges.length / 2;
    buffer.segEdges.push(edge0, edge1);
    if (buffer.segA.has(edge0)) {
        buffer.segB.set(edge0, segIndex);
    } else {
        buffer.segA.set(edge0, segIndex);
    }
    if (buffer.segA.has(edge1)) {
        buffer.segB.set(edge1, segIndex);
    } else {
        buffer.segA.set(edge1, segIndex);
    }
};

/**
 * Walks the stitched segments starting from `startEdge` / `startSeg`, producing one polyline.
 * @ignore
 */
const walkPolyline = (buffer: TLevelBuffer, visited: Uint8Array, startEdge: number, startSeg: number): number[] => {
    const points: number[] = [];
    let edge = startEdge;
    let seg: number | undefined = startSeg;
    const pushPoint = (edgeId: number) => {
        const offset = buffer.edgeCoord.get(edgeId)!;
        points.push(buffer.coords[offset], buffer.coords[offset + 1]);
    };
    pushPoint(edge);
    while (seg !== undefined && !visited[seg]) {
        visited[seg] = 1;
        const edge0 = buffer.segEdges[seg * 2];
        const edge1 = buffer.segEdges[seg * 2 + 1];
        const nextEdge = edge0 === edge ? edge1 : edge0;
        pushPoint(nextEdge);
        edge = nextEdge;
        const candidateA = buffer.segA.get(edge);
        const candidateB = buffer.segB.get(edge);
        seg = candidateA !== undefined && !visited[candidateA]
            ? candidateA
            : candidateB !== undefined && !visited[candidateB] ? candidateB : undefined;
    }
    return points;
};

/** Stitches the segments of one level into polylines. @ignore */
const stitchLevel = (buffer: TLevelBuffer): TContourPolyline[] => {
    const segCount = buffer.segEdges.length / 2;
    const visited = new Uint8Array(segCount);
    const result: TContourPolyline[] = [];

    const emit = (points: number[]) => {
        const isClosed = points[0] === points[points.length - 2] && points[1] === points[points.length - 1];
        result.push({ level: buffer.level, points, isClosed });
    };

    // Open curves first, so they are traced end-to-end rather than started from the middle.
    // An edge touched by a single segment is an open end (it lies on the border of the traced region).
    for (let seg = 0; seg < segCount; seg++) {
        if (visited[seg]) continue;
        const edge0 = buffer.segEdges[seg * 2];
        const edge1 = buffer.segEdges[seg * 2 + 1];
        const openEnd = !buffer.segB.has(edge0) ? edge0 : !buffer.segB.has(edge1) ? edge1 : undefined;
        if (openEnd !== undefined) emit(walkPolyline(buffer, visited, openEnd, seg));
    }
    // Anything left is a closed loop, which can be started anywhere.
    for (let seg = 0; seg < segCount; seg++) {
        if (visited[seg]) continue;
        emit(walkPolyline(buffer, visited, buffer.segEdges[seg * 2], seg));
    }
    return result;
};

/**
 * Traces contour polylines through a 2D array of z values using marching squares, for every
 * requested level in a single pass over the cells.
 * @param zValues the heatmap values, indexed `[row][column]`
 * @param levels the z levels to trace. Order does not matter - each polyline carries its own level
 * @param stride only every stride-th row and column is sampled
 * @remarks
 * The traced geometry matches what {@link UniformContoursDrawingProvider} draws: the contour
 * surface is the bilinear interpolation of the z values, sampled at the grid points.
 */
export const traceContours = (
    zValues: NumberArray[],
    levels: number[],
    stride: number
): TContourPolyline[] => {
    if (!zValues?.length || !zValues[0]?.length || !levels?.length) return [];
    stride = Math.max(1, stride);
    const xs = buildSampleIndices(zValues[0].length - 1, stride);
    const ys = buildSampleIndices(zValues.length - 1, stride);
    const nx = xs.length;
    const ny = ys.length;
    if (nx < 2 || ny < 2) return [];

    const sorted = levels.slice().sort((left, right) => left - right);
    const levelCount = sorted.length;
    const buffers: TLevelBuffer[] = sorted.map(level => ({
        level,
        segEdges: [],
        segA: new Map<number, number>(),
        segB: new Map<number, number>(),
        coords: [],
        edgeCoord: new Map<number, number>()
    }));

    // Edge ids. A horizontal edge spans nodes (a, b) - (a + 1, b), a vertical edge (a, b) - (a, b + 1).
    const vBase = nx * ny;

    for (let b = 0; b < ny - 1; b++) {
        const row0 = zValues[ys[b]];
        const row1 = zValues[ys[b + 1]];
        const j0 = ys[b];
        const j1 = ys[b + 1];
        for (let a = 0; a < nx - 1; a++) {
            const i0 = xs[a];
            const i1 = xs[a + 1];
            const v00 = row0[i0];
            const v10 = row0[i1];
            const v11 = row1[i1];
            const v01 = row1[i0];
            // NaN fails every comparison, so a cell with holes is skipped rather than
            // producing a contour through undefined data.
            if (v00 !== v00 || v10 !== v10 || v11 !== v11 || v01 !== v01) continue;

            const min = Math.min(v00, v10, v11, v01);
            const max = Math.max(v00, v10, v11, v01);

            // With "corner is above" defined as value > level, a cell contains a crossing
            // exactly when min <= level < max.
            for (let k = lowerBound(sorted, min); k < levelCount && sorted[k] < max; k++) {
                const buffer = buffers[k];
                const level = buffer.level;
                const bits =
                    (v00 > level ? 1 : 0) | (v10 > level ? 2 : 0) | (v11 > level ? 4 : 0) | (v01 > level ? 8 : 0);

                const bottomEdge = () => addEdgePoint(buffer, b * nx + a, level, v00, v10, i0, j0, i1, j0);
                const topEdge = () => addEdgePoint(buffer, (b + 1) * nx + a, level, v01, v11, i0, j1, i1, j1);
                const leftEdge = () => addEdgePoint(buffer, vBase + b * nx + a, level, v00, v01, i0, j0, i0, j1);
                const rightEdge = () => addEdgePoint(buffer, vBase + b * nx + a + 1, level, v10, v11, i1, j0, i1, j1);

                switch (bits) {
                    case 1:
                    case 14:
                        addSegment(buffer, leftEdge(), bottomEdge());
                        break;
                    case 2:
                    case 13:
                        addSegment(buffer, bottomEdge(), rightEdge());
                        break;
                    case 3:
                    case 12:
                        addSegment(buffer, leftEdge(), rightEdge());
                        break;
                    case 4:
                    case 11:
                        addSegment(buffer, rightEdge(), topEdge());
                        break;
                    case 6:
                    case 9:
                        addSegment(buffer, bottomEdge(), topEdge());
                        break;
                    case 7:
                    case 8:
                        addSegment(buffer, topEdge(), leftEdge());
                        break;
                    // Saddles. The cell centre decides which pair of corners is joined,
                    // which is what bilinear interpolation of the four corners gives.
                    case 5:
                    case 10: {
                        const centreAbove = (v00 + v10 + v11 + v01) / 4 > level;
                        const isolateDiagonal = bits === 5 ? !centreAbove : centreAbove;
                        if (isolateDiagonal) {
                            addSegment(buffer, leftEdge(), bottomEdge());
                            addSegment(buffer, rightEdge(), topEdge());
                        } else {
                            addSegment(buffer, bottomEdge(), rightEdge());
                            addSegment(buffer, topEdge(), leftEdge());
                        }
                        break;
                    }
                }
            }
        }
    }

    return buffers.flatMap(stitchLevel);
};
