import { Rect } from "scichart";
import { ELayoutStrategyType } from "scichart";
import type { AxisBase2D } from "scichart";
import type { SciChartSurface } from "scichart";
import { getCoordinateWithCoordinateMode, layoutAxisParts, layoutAxisPartsLeftStrategy } from "scichart";
import type { IInnerAxisLayoutStrategyOptions } from "scichart";
import { BaseCenteredAxisLayoutStrategy } from "scichart";
import type { ChartLayoutState } from "scichart";

/**
 * A LayoutStrategy for Parallel Coordinate Plots, which places each vertical inner axis at its own
 * position on the orthogonal (horizontal) axis.
 * @remarks
 * By default axis with index i in the group is placed at data value i on the horizontal axis,
 * so N dimension axes are drawn at x = 0, 1, ..., N-1.
 * Use {@link axisPositions} to override the position per axis id, which also acts as the hook for
 * reordering dimensions.
 * Unlike {@link LeftAlignedInnerAxisLayoutStrategy}, which anchors the whole group at a single
 * {@link BaseCenteredAxisLayoutStrategy.axisPosition} and stacks the axes, this strategy positions every axis independently.
 * Assign to {@link LayoutManager.leftInnerAxesLayoutStrategy} and add axes with
 * axisAlignment {@link EAxisAlignment.Left} and isInnerAxis = true.
 * Each axis is drawn with its title to the left of the axis line and its labels/ticks to the right.
 */
export class ParallelCoordinatesInnerAxisLayoutStrategy extends BaseCenteredAxisLayoutStrategy {
    public readonly type: ELayoutStrategyType = ELayoutStrategyType.ParallelCoordinates;

    /**
     * Optional map of axis id to position on the orthogonal axis.
     * The position obeys {@link BaseCenteredAxisLayoutStrategy.coordinateMode} (data value by default).
     * Axes not present in the map use their index within the group.
     */
    public axisPositions: Map<string, number> | undefined;

    constructor(options?: IInnerAxisLayoutStrategyOptions) {
        super(options);
        // Title occupies the left part of the axis viewRect, labels/ticks the right part
        this.layoutAxisPartsStrategy = layoutAxisPartsLeftStrategy;
    }

    public measureAxes(sciChartSurface: SciChartSurface, chartLayoutState: ChartLayoutState, axes: AxisBase2D[]) {
        this.sciChartSurface = sciChartSurface;

        axes.forEach((axis) => {
            axis.measure();
            this.updateAxisLayoutState(axis);
        });

        // Dimension axes are drawn inside the series area, no outer space is reserved
        return 0;
    }

    public override updateAreaSize(chartLayoutState: ChartLayoutState, requiredSize: number) {
        chartLayoutState.leftInnerAreaSize = 0;
    }

    public layoutAxes(left: number, top: number, right: number, bottom: number, axes: AxisBase2D[]): void {
        if (axes.length === 0) {
            return;
        }

        const horizontalAxis =
            this.sciChartSurface.getXAxisById(this.orthogonalAxisId) ?? this.sciChartSurface.getDefaultXAxis();
        if (!horizontalAxis || !horizontalAxis.isHorizontalAxis) {
            throw new Error("orthogonalAxisId should be a valid id of horizontal axis on the surface!");
        }

        const coordinateCalculator = horizontalAxis.getCurrentCoordinateCalculator();
        const seriesViewRectLeft = horizontalAxis.parentSurface.seriesViewRect.left;

        axes.forEach((axis, index) => {
            // Set axisLength to default value which is seriesViewRect.height
            axis.axisLength = undefined;
            axis.offset = 0;

            const position = this.axisPositions?.get(axis.id) ?? index;
            const axisCoord =
                getCoordinateWithCoordinateMode(position, coordinateCalculator, this.coordinateMode) +
                seriesViewRectLeft;

            // Split the axis viewRect around the axis line at axisCoord: the title occupies the space to
            // the left of the line, the axis renderer (line + ticks + labels) the space to the right.
            // layoutAxisPartsLeftStrategy lays the title into the left part and the labels into the right part,
            // so the axis line lands exactly at axisCoord (the category position).
            const titleWidth = axis.axisTitleRenderer.desiredWidth;
            const labelWidth = axis.axisRenderer.desiredWidth;
            axis.viewRect = Rect.createWithCoords(axisCoord - titleWidth, top, axisCoord + labelWidth, bottom);

            layoutAxisParts(axis, this.layoutAxisPartsStrategy);
        });
    }
}
