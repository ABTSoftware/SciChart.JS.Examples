import {
    ChartModifierBase2D,
    ModifierMouseArgs,
    EChart2DModifierType,
    translateFromCanvasToSeriesViewRect,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    IPointMarkerPaletteProvider,
    EStrokePaletteMode,
    TPointMarkerArgb,
    IRenderableSeries,
    parseColorToUIntArgb,
} from "scichart";

// ─── Simulation types (re-exported for use in drawExample.ts) ────────────────

export interface SimNode {
    iata: string;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    geoX: number;
    geoY: number;
}

export interface SimEdge {
    sourceIdx: number;
    targetIdx: number;
}

// ─── Edge hover state ────────────────────────────────────────────────────────

export class EdgeHoverState {
    public hoveredNodeIdx = -1;
}

// ─── Node tooltip modifier ───────────────────────────────────────────────────

const TOOLTIP_SNAP_PIXELS = 12;
const LABEL_TEXT_COLOR = "#ffffff";
const LABEL_BACKGROUND_COLOR = "rgba(23,36,61,0.92)";

export class NodeTooltipModifier extends ChartModifierBase2D {
    public readonly type = EChart2DModifierType.Custom;
    private nodes: SimNode[];
    private edges: SimEdge[];
    private edgePalette: EdgeHoverState;
    private adjacency: Set<number>[];
    private pool: TextAnnotation[] = [];
    private lastHoveredIdx = -1;
    private requestRedraw: () => void;

    constructor(nodes: SimNode[], edges: SimEdge[], edgePalette: EdgeHoverState, requestRedraw: () => void) {
        super();
        this.nodes = nodes;
        this.edges = edges;
        this.edgePalette = edgePalette;
        this.requestRedraw = requestRedraw;

        this.adjacency = nodes.map(() => new Set<number>());
        for (const e of edges) {
            this.adjacency[e.sourceIdx].add(e.targetIdx);
            this.adjacency[e.targetIdx].add(e.sourceIdx);
        }

        const maxDegree = this.adjacency.reduce((m, s) => Math.max(m, s.size), 0) + 1;
        for (let i = 0; i < maxDegree; i++) {
            this.pool.push(new TextAnnotation({
                isHidden: true,
                xCoordinateMode: ECoordinateMode.DataValue,
                yCoordinateMode: ECoordinateMode.DataValue,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
                textColor: LABEL_TEXT_COLOR,
                fontSize: 14,
                fontFamily: "sans-serif",
                background: LABEL_BACKGROUND_COLOR,
                x1: 0, y1: 0, text: "",
            }));
        }
    }

    public onAttach(): void {
        super.onAttach();
        for (const a of this.pool) this.parentSurface.annotations.add(a);
    }

    public onDetach(): void {
        for (const a of this.pool) this.parentSurface.annotations.remove(a);
        super.onDetach();
    }

    private toDataCoords(args: ModifierMouseArgs): { x: number; y: number } | null {
        const svp = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect, false);
        if (!svp) return null;
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        return { x: xCalc.getDataValue(svp.x), y: yCalc.getDataValue(svp.y) };
    }

    private showLabels(hoveredIdx: number): void {
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const offsetDataUnits = Math.abs(xCalc.getDataValue(8) - xCalc.getDataValue(0));
        const toLabel = [hoveredIdx, ...this.adjacency[hoveredIdx]];
        let poolIdx = 0;
        for (const nodeIdx of toLabel) {
            const node = this.nodes[nodeIdx];
            const a = this.pool[poolIdx++];
            a.text = node.label;
            a.x1 = node.x + offsetDataUnits;
            a.y1 = node.y;
            a.isHidden = false;
        }
        for (; poolIdx < this.pool.length; poolIdx++) {
            if (!this.pool[poolIdx].isHidden) this.pool[poolIdx].isHidden = true;
        }
    }

    private hideAll(): void {
        for (const a of this.pool) {
            if (!a.isHidden) a.isHidden = true;
        }
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        const pt = this.toDataCoords(args);
        if (!pt) { this.edgePalette.hoveredNodeIdx = -1; this.hideAll(); return; }

        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const snapDataUnits = Math.abs(xCalc.getDataValue(TOOLTIP_SNAP_PIXELS) - xCalc.getDataValue(0));

        let closestIdx = -1;
        let minDist = Infinity;
        for (let i = 0; i < this.nodes.length; i++) {
            const dx = this.nodes[i].x - pt.x;
            const dy = this.nodes[i].y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) { minDist = dist; closestIdx = i; }
        }

        if (closestIdx >= 0 && minDist <= snapDataUnits) {
            if (closestIdx !== this.lastHoveredIdx) {
                this.edgePalette.hoveredNodeIdx = closestIdx;
                this.lastHoveredIdx = closestIdx;
                this.requestRedraw();
            }
            this.showLabels(closestIdx);
        } else {
            if (this.lastHoveredIdx !== -1) {
                this.edgePalette.hoveredNodeIdx = -1;
                this.hideAll();
                this.lastHoveredIdx = -1;
                this.requestRedraw();
            }
        }
    }

    public modifierMouseWheel(args: ModifierMouseArgs): void {
        super.modifierMouseWheel(args);
        if (this.lastHoveredIdx !== -1) {
            this.showLabels(this.lastHoveredIdx);
        }
    }

    public modifierMouseLeave(args: ModifierMouseArgs): void {
        super.modifierMouseLeave(args);
        if (this.lastHoveredIdx !== -1) {
            this.edgePalette.hoveredNodeIdx = -1;
            this.hideAll();
            this.lastHoveredIdx = -1;
            this.requestRedraw();
        }
    }
}

// ─── Node drag modifier ───────────────────────────────────────────────────────

interface DragState {
    nodeIdx: number;
    dataX: number;
    dataY: number;
}

export type DragStateRef = { current: DragState | null };

const DRAG_SNAP_PIXELS = 8;

export class NodeDragModifier extends ChartModifierBase2D {
    public readonly type = EChart2DModifierType.Custom;
    private nodes: SimNode[];
    private dragState: DragStateRef;
    private reheat: () => void;

    constructor(nodes: SimNode[], dragState: DragStateRef, reheat: () => void) {
        super();
        this.nodes = nodes;
        this.dragState = dragState;
        this.reheat = reheat;
    }

    private toDataCoords(args: ModifierMouseArgs): { x: number; y: number } | null {
        const svp = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect, false);
        if (!svp) return null;
        const x = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(svp.x);
        const y = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(svp.y);
        return { x, y };
    }

    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        const pt = this.toDataCoords(args);
        if (!pt) return;

        let closestIdx = -1;
        let minDist = Infinity;
        for (let i = 0; i < this.nodes.length; i++) {
            const dx = this.nodes[i].x - pt.x;
            const dy = this.nodes[i].y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) { minDist = dist; closestIdx = i; }
        }

        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const snapDataUnits = Math.abs(xCalc.getDataValue(DRAG_SNAP_PIXELS) - xCalc.getDataValue(0));

        if (closestIdx >= 0 && minDist <= snapDataUnits) {
            this.dragState.current = { nodeIdx: closestIdx, dataX: pt.x, dataY: pt.y };
            this.reheat();
            args.handled = true;
        }
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        if (!this.dragState.current) return;
        const pt = this.toDataCoords(args);
        if (!pt) return;
        this.dragState.current.dataX = pt.x;
        this.dragState.current.dataY = pt.y;
        args.handled = true;
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        if (!this.dragState.current) return;
        this.dragState.current = null;
        this.reheat();
        args.handled = true;
    }
}

// ─── Node hover palette provider ─────────────────────────────────────────────

// const HOVER_FILL = parseColorToUIntArgb("#634e96");   // SciChart purple
// const HOVER_STROKE = parseColorToUIntArgb("#634e96");   // SciChart purple

const HOVER_FILL = parseColorToUIntArgb("#47bde6");   // SciChart purple
const HOVER_STROKE = parseColorToUIntArgb("#274b92");   // SciChart purple

// #47bde6  #274b92


export class NodeHoverPaletteProvider implements IPointMarkerPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    private edgeHover: EdgeHoverState;

    constructor(edgeHover: EdgeHoverState) {
        this.edgeHover = edgeHover;
    }

    public onAttached(_parentSeries: IRenderableSeries): void {}
    public onDetached(): void {}

    public overridePointMarkerArgb(
        _xValue: number,
        _yValue: number,
        index: number
    ): TPointMarkerArgb | undefined {
        if (index === this.edgeHover.hoveredNodeIdx) {
            return { fill: HOVER_FILL, stroke: HOVER_STROKE };
        }
        return undefined;
    }
}
