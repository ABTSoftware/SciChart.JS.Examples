import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    XyxyDataSeries,
    XyScatterRenderableSeries,
    FastLineSegmentRenderableSeries,
    EllipsePointMarker,
    NumberRange,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    PinchZoomModifier,
    EAutoRange,
} from "scichart";
import { appTheme } from "../../../theme";
import {
    SimNode,
    SimEdge,
    EdgeHoverState,
    NodeTooltipModifier,
    NodeDragModifier,
    NodeHoverPaletteProvider,
    DragStateRef,
} from "./nodeModifiers";
import { AIRPORTS, ROUTES } from "./airportData";

// ─── Build simulation state ───────────────────────────────────────────────────

function buildSimulation(): { nodes: SimNode[]; edges: SimEdge[] } {
    const iataToIdx = new Map<string, number>();
    const centerLon = -96;
    const centerLat = 38;
    const scaleX = 4.5;
    const scaleY = 5.5;

    const nodes: SimNode[] = AIRPORTS.map((a, i) => {
        iataToIdx.set(a.iata, i);
        const geoX = (a.lon - centerLon) * scaleX;
        const geoY = (a.lat - centerLat) * scaleY;
        return { iata: a.iata, label: `${a.iata} – ${a.city}, ${a.state}`, x: geoX, y: geoY, vx: 0, vy: 0, geoX, geoY };
    });

    const edges: SimEdge[] = ROUTES.map((r) => {
        const si = iataToIdx.get(r.origin);
        const ti = iataToIdx.get(r.destination);
        if (si === undefined || ti === undefined) return null;
        return { sourceIdx: si, targetIdx: ti };
    }).filter((e): e is SimEdge => e !== null);

    return { nodes, edges };
}

// ─── Force simulation tick ────────────────────────────────────────────────────

const REPULSION_STRENGTH = -120;
const REPULSION_MIN_DIST = 1;
const SPRING_K = 0.3;
const SPRING_REST_LENGTH = 20;
const GEO_ANCHOR_STRENGTH = 0.12;
const VELOCITY_DECAY = 0.6;

function tick(nodes: SimNode[], edges: SimEdge[], alpha: number): void {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), REPULSION_MIN_DIST);
            const force = (REPULSION_STRENGTH * alpha) / (dist * dist);
            const fx = force * (dx / dist);
            const fy = force * (dy / dist);
            nodes[i].vx += fx;
            nodes[i].vy += fy;
            nodes[j].vx -= fx;
            nodes[j].vy -= fy;
        }
    }

    for (const edge of edges) {
        const src = nodes[edge.sourceIdx];
        const tgt = nodes[edge.targetIdx];
        const dx = tgt.x + tgt.vx - (src.x + src.vx);
        const dy = tgt.y + tgt.vy - (src.y + src.vy);
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = SPRING_K * (dist - SPRING_REST_LENGTH) * alpha;
        const fx = force * (dx / dist);
        const fy = force * (dy / dist);
        src.vx += fx * 0.5;
        src.vy += fy * 0.5;
        tgt.vx -= fx * 0.5;
        tgt.vy -= fy * 0.5;
    }

    for (const node of nodes) {
        node.vx += (node.geoX - node.x) * GEO_ANCHOR_STRENGTH * alpha;
        node.vy += (node.geoY - node.y) * GEO_ANCHOR_STRENGTH * alpha;
    }

    for (const node of nodes) {
        node.vx *= VELOCITY_DECAY;
        node.vy *= VELOCITY_DECAY;
        node.x += node.vx;
        node.y += node.vy;
    }
}

// ─── Chart initialization ─────────────────────────────────────────────────────

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        autoRange: EAutoRange.Never,
        visibleRangeLimit: new NumberRange(-600, 600),
    });
    const yAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        autoRange: EAutoRange.Never,
        visibleRangeLimit: new NumberRange(-600, 600),
    });
    xAxis.visibleRange = new NumberRange(-300, 300);
    yAxis.visibleRange = new NumberRange(-300, 300);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const { nodes, edges } = buildSimulation();

    const edgeHover = new EdgeHoverState();

    const edgeDataSeries = new XyxyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries: edgeDataSeries,
            stroke: "#47bde650",
            strokeThickness: 2,
        })
    );

    const edgeHighlightDataSeries = new XyxyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries: edgeHighlightDataSeries,
            stroke: "#47bde6",
            strokeThickness: 3,
        })
    );

    const nodeDataSeries = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: nodeDataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 14,
                height: 14,
                fill: "#274b92",
                stroke: "#47bde6",
                strokeThickness: 1.5,
            }),
            paletteProvider: new NodeHoverPaletteProvider(edgeHover),
        })
    );

    const dragState: DragStateRef = { current: null };

    let alpha = 1.0;
    let running = true;
    let loopAlive = false;
    let autoZoomed = false;
    let animFrameId: number = 0;

    function frame() {
        if (!running || sciChartSurface.isDeleted) {
            loopAlive = false;
            return;
        }

        const simActive = alpha >= 0.001 || !!dragState.current;

        if (simActive) {
            tick(nodes, edges, alpha);
            alpha *= 0.9772;

            if (!autoZoomed && alpha < 0.5) {
                autoZoomed = true;
                sciChartSurface.zoomExtents(200);
            }

            if (dragState.current) {
                const n = nodes[dragState.current.nodeIdx];
                n.x = dragState.current.dataX;
                n.y = dragState.current.dataY;
                n.vx = 0;
                n.vy = 0;
                alpha = Math.max(alpha, 0.1);
            }
        }

        const ex: number[] = [],
            ey: number[] = [],
            ex1: number[] = [],
            ey1: number[] = [];
        const hx: number[] = [],
            hy: number[] = [],
            hx1: number[] = [],
            hy1: number[] = [];
        const h = edgeHover.hoveredNodeIdx;
        for (const edge of edges) {
            const src = nodes[edge.sourceIdx],
                tgt = nodes[edge.targetIdx];
            if (h !== -1 && (edge.sourceIdx === h || edge.targetIdx === h)) {
                hx.push(src.x);
                hy.push(src.y);
                hx1.push(tgt.x);
                hy1.push(tgt.y);
            } else {
                ex.push(src.x);
                ey.push(src.y);
                ex1.push(tgt.x);
                ey1.push(tgt.y);
            }
        }
        edgeDataSeries.clear();
        edgeDataSeries.appendRange(ex, ey, ex1, ey1);
        edgeHighlightDataSeries.clear();
        edgeHighlightDataSeries.appendRange(hx, hy, hx1, hy1);

        nodeDataSeries.clear();
        nodeDataSeries.appendRange(
            nodes.map((n) => n.x),
            nodes.map((n) => n.y)
        );

        if (simActive) {
            animFrameId = requestAnimationFrame(frame);
        } else {
            loopAlive = false;
        }
    }

    function startLoop() {
        if (!loopAlive) {
            loopAlive = true;
            animFrameId = requestAnimationFrame(frame);
        }
    }

    sciChartSurface.chartModifiers.add(
        new NodeTooltipModifier(nodes, edges, edgeHover, () => startLoop()),
        new NodeDragModifier(nodes, dragState, () => {
            alpha = Math.max(alpha, 0.3);
            startLoop();
        }),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new PinchZoomModifier()
    );

    startLoop();

    return {
        sciChartSurface,
        wasmContext,
        stopAnimation: () => {
            running = false;
            if (animFrameId) cancelAnimationFrame(animFrameId);
        },
    };
};
