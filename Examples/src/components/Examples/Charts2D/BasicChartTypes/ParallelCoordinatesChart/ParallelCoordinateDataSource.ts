import type { IDeletable } from "scichart";
import { NumberRange } from "scichart";
import { Point } from "scichart";
import { translateFromCanvasToSeriesViewRect } from "scichart";
import { EAutoRange } from "scichart";
import { EAxisAlignment } from "scichart";
import { EAxisType } from "scichart";
import { ESurfaceType } from "scichart";
import type { TSciChart } from "scichart";
import { EResamplingMode } from "scichart";
import { ParallelCoordinatesInnerAxisLayoutStrategy } from "./ParallelCoordinatesInnerAxisLayoutStrategy";
import type { IPointMetadata } from "scichart";
import { XyDataSeries } from "scichart";
import { parseColorToUIntArgb } from "scichart";
import { ParallelCoordinatePaletteProvider } from "./ParallelCoordinatePaletteProvider";
import type { AxisBase2D, IAxisBase2dOptions } from "scichart";
import { NumericLabelProvider } from "scichart";
import { TextLabelProvider } from "scichart";
import { LogarithmicAxis } from "scichart";
import { NumericAxis } from "scichart";
import type { PolarAxisBase } from "scichart";
import { PolarNumericAxis } from "scichart";
import { EPolarAxisMode } from "scichart";
import { FastLineRenderableSeries, IFastLineRenderableSeriesOptions } from "scichart";
import type { IRenderableSeries } from "scichart";
import { PolarLineRenderableSeries } from "scichart";
import { EllipsePointMarker } from "scichart";
import type { ISplineLineRenderableSeriesOptions } from "scichart";
import { SplineLineRenderableSeries } from "scichart";
import type { SciChartSurface } from "scichart";

/**
 * The id of the hidden Y axis created by {@link ParallelCoordinateDataSource},
 * which all parallel coordinate series are bound to
 */
export const PCP_HIDDEN_YAXIS_ID = "pcp-hidden-yAxis";

/**
 * Metadata attached to every data point created by {@link ParallelCoordinateDataSource},
 * holding the actual (pre-normalization) value so it can be displayed on tooltips
 */
export interface TParallelPointMetadata extends IPointMetadata {
    /**
     * The actual data value of the point, before normalization to the hidden axis coordinate space
     */
    value: number | string;
    /**
     * The name of the category the point belongs to
     */
    category: string;
    /**
     * The index of the record (the line/polyline) this point belongs to. In single-series mode this identifies
     * which record a point belongs to even though every record shares one renderable series. Gap points use -1.
     */
    recordIndex: number;
}

/**
 * Defines one category (dimension) of a Parallel Coordinate Plot
 */
export interface IParallelCoordinateCategory {
    /**
     * The category name, used as the axis title and the default axis id
     */
    name: string;
    /**
     * The values for this category, one per record. All categories must have the same number of values.
     * String values require axisType {@link EAxisType.CategoryAxis}
     */
    values: Array<number | string>;
    /**
     * The axis type for this category. One of {@link EAxisType.CategoryAxis}, {@link EAxisType.NumericAxis}
     * or {@link EAxisType.LogarithmicAxis}. Default {@link EAxisType.NumericAxis}
     */
    axisType?: EAxisType;
    /**
     * Optional axis options applied to the category axis
     */
    axisOptions?: IAxisBase2dOptions;
}

/**
 * Options passed to the {@link ParallelCoordinateDataSource} constructor
 */
export interface IParallelCoordinateDataSourceOptions {
    /**
     * The relative padding applied when deriving a category axis {@link AxisCore.visibleRange} from data. Default 0.1
     */
    rangePadding?: number;
    /**
     * Polar only. The angle (radians) of the first category axis. When set, it is applied as
     * {@link PolarAxisBase.startAngle} of the angular X axis so category positions and radial axes stay aligned.
     * When omitted, the angular X axis startAngle is left unchanged
     */
    startAngle?: number;
    /**
     * Polar only. When true (the default), each record polyline is closed by repeating the first category value
     * at the full circle position, producing a closed radar/spider polygon
     */
    closeLoop?: boolean;
    /**
     * When true, all records are drawn as a single renderable series backed by a single {@link XyDataSeries},
     * with the records concatenated and separated by NaN gaps (so the line breaks between records).
     * This collapses one-draw-call-per-record into a single draw call, dramatically improving performance
     * for large datasets (thousands of records). The trade-off is that every record shares one style: the
     * options returned by {@link createSeriesFn} for record index 0 are used for the whole series, and there
     * are no per-record series objects for selection/hit-testing. Default false (one series per record).
     */
    useSingleSeries?: boolean;
    /**
     * When set to a positive value, an ellipse point marker of this size (in pixels) is drawn at each category
     * vertex, filled/outlined with the same colour as that record's line ({@link createSeriesFn}'s stroke).
     * Default undefined (no point markers).
     */
    pointMarkerSize?: number;
}

/**
 * @summary The data source for creating Parallel Coordinate Plots on an existing {@link SciChartSurface}
 * @description
 * A Parallel Coordinate Plot draws each record as a polyline across N vertical category axes,
 * where each Y value is scaled by its own category axis.
 *
 * Add categories with {@link addCategory} (one array of values per category, all of equal length),
 * then call {@link build} to create the category Y axes, the hidden coordinate axis, and one
 * {@link XyDataSeries} + renderable series per record. Data values are normalized into the
 * coordinate space of the hidden Y axis (0..1) using each category axis visibleRange, so before
 * drawing every value is already converted from data space to coordinate space.
 *
 * ```ts
 * const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
 * sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
 *
 * const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface);
 * data.addCategory("name", ["Ford Mustang", "Toyota Corolla"], EAxisType.CategoryAxis);
 * data.addCategory("Price", [45000, 23125], EAxisType.NumericAxis);
 * data.createSeriesFn = (index) => ({ stroke: index === 0 ? "red" : "blue" });
 * data.build();
 * ```
 */
export class ParallelCoordinateDataSource implements IDeletable {
    /**
     * A callback used to create the renderable series for the record at the given index.
     * When {@link ISplineLineRenderableSeriesOptions.interpolationPoints} is 0 (the default)
     * a {@link FastLineRenderableSeries} is created, otherwise a {@link SplineLineRenderableSeries}
     */
    public createSeriesFn: (index: number) => ISplineLineRenderableSeriesOptions = () => ({});
    public yGrowBy = new NumberRange(0.06, 0.06);

    protected readonly webAssemblyContext: TSciChart;
    protected readonly sciChartSurface: SciChartSurface;
    protected readonly rangePadding: number;
    protected readonly startAngle: number | undefined;
    protected readonly closeLoop: boolean;
    protected readonly useSingleSeries: boolean;
    protected readonly pointMarkerSize: number | undefined;

    protected categoriesProperty: IParallelCoordinateCategory[] = [];
    protected yAxesProperty: AxisBase2D[] = [];
    protected renderableSeriesProperty: IRenderableSeries[] = [];
    protected hiddenYAxis: AxisBase2D | undefined;
    protected xAxisProperty: AxisBase2D | undefined;
    protected layoutStrategy: ParallelCoordinatesInnerAxisLayoutStrategy | undefined;
    /** Maps unique string value to its index, per CategoryAxis-type category */
    protected uniqueValuesMaps: Array<Map<string, number> | undefined> = [];
    /**
     * The fixed data-value range used to normalize each category, in category order.
     * Normalization is always relative to this build-time range, so that zooming and panning
     * (which changes the category axes' visibleRange) never re-scales the stored coordinates.
     */
    protected normalizationRanges: NumberRange[] = [];
    private hiddenRangeUnsubscribe: (() => void) | undefined;
    private isBuilding: boolean = false;
    /** Single-series mode only: colours each record's polyline via per-point ARGB (see {@link useSingleSeries}) */
    private singlePaletteProvider: ParallelCoordinatePaletteProvider | undefined;
    /** Single-series record selection: the overlay renderable series drawing the selected record on top. */
    private selectionOverlaySeries: IRenderableSeries | undefined;
    /** The record index currently drawn as the selection overlay, re-applied after each rebuild. */
    private selectionOverlayRecordIndex: number | undefined;
    /**
     * Bumped on every {@link build} so {@link hitTestRecord}'s spline cache is invalidated after the data or
     * category order changes, even when the axis ranges are unchanged.
     */
    private dataVersion: number = 0;
    /** The axis ranges + data version the cached on-screen spline values were last computed for. */
    private splineCacheXRange: { min: number; max: number } | undefined;
    private splineCacheYRange: { min: number; max: number } | undefined;
    private splineCacheDataVersion: number = -1;

    constructor(
        webAssemblyContext: TSciChart,
        sciChartSurface: SciChartSurface,
        options?: IParallelCoordinateDataSourceOptions
    ) {
        this.webAssemblyContext = webAssemblyContext;
        this.sciChartSurface = sciChartSurface;
        this.rangePadding = options?.rangePadding ?? 0.1;
        this.startAngle = options?.startAngle;
        this.closeLoop = options?.closeLoop ?? true;
        this.useSingleSeries = options?.useSingleSeries ?? false;
        this.pointMarkerSize = options?.pointMarkerSize;
    }

    /**
     * Builds an ellipse point marker of {@link pointMarkerSize}, coloured to match the given line stroke,
     * or undefined when point markers are disabled / no stroke is available.
     */
    private createPointMarker(stroke: string | undefined): EllipsePointMarker | undefined {
        if (!this.pointMarkerSize || this.pointMarkerSize <= 0 || !stroke) {
            return undefined;
        }
        return new EllipsePointMarker(this.webAssemblyContext, {
            width: this.pointMarkerSize,
            height: this.pointMarkerSize,
            fill: stroke,
            stroke,
        });
    }

    /**
     * When true, the data source targets a {@link SciChartPolarSurface} and creates radial category axes
     * at angles instead of vertical inner axes
     */
    public get isPolar(): boolean {
        return this.sciChartSurface.surfaceType === ESurfaceType.SciChartPolarSurfaceType;
    }

    /**
     * The category Y axes in category order. This is populated by {@link build}
     */
    public get yAxes(): AxisBase2D[] {
        return this.yAxesProperty;
    }

    /**
     * The renderable series, one per record. This is populated by {@link build}
     */
    public get renderableSeries(): IRenderableSeries[] {
        return this.renderableSeriesProperty;
    }

    /**
     * The categories added with {@link addCategory}
     */
    public get categories(): IParallelCoordinateCategory[] {
        return this.categoriesProperty;
    }

    /**
     * Adds a category (dimension) to the plot. Call {@link build} afterwards to (re)create the chart
     * @param name The category name, used as the axis title and the default axis id
     * @param values The values for this category, one per record
     * @param axisType One of {@link EAxisType.CategoryAxis}, {@link EAxisType.NumericAxis},
     * {@link EAxisType.LogarithmicAxis}. Default {@link EAxisType.NumericAxis},
     * or {@link EAxisType.CategoryAxis} if the values are strings
     * @param axisOptions Optional axis options applied to the category axis
     */
    public addCategory(
        name: string,
        values: Array<number | string>,
        axisType?: EAxisType,
        axisOptions?: IAxisBase2dOptions
    ): void {
        if (!name) {
            throw new Error("Category name is required");
        }
        if (!values || values.length === 0) {
            throw new Error(`Category "${name}" must have at least one value`);
        }
        if (this.categoriesProperty.some((c) => c.name === name)) {
            throw new Error(`Category "${name}" has already been added`);
        }
        const recordsCount = this.categoriesProperty[0]?.values.length;
        if (recordsCount !== undefined && values.length !== recordsCount) {
            throw new Error(
                `Category "${name}" has ${values.length} values, but existing categories have ${recordsCount}. All categories must have the same number of values`
            );
        }
        const hasStringValues = values.some((v) => typeof v === "string");
        const resolvedAxisType = axisType ?? (hasStringValues ? EAxisType.CategoryAxis : EAxisType.NumericAxis);
        if (![EAxisType.CategoryAxis, EAxisType.NumericAxis, EAxisType.LogarithmicAxis].includes(resolvedAxisType)) {
            throw new Error(
                `Category "${name}": axisType must be CategoryAxis, NumericAxis or LogarithmicAxis, but got "${resolvedAxisType}"`
            );
        }
        if (hasStringValues && resolvedAxisType !== EAxisType.CategoryAxis) {
            throw new Error(`Category "${name}" has string values, which require EAxisType.CategoryAxis`);
        }
        if (this.isPolar && resolvedAxisType === EAxisType.LogarithmicAxis) {
            throw new Error(
                `Category "${name}": LogarithmicAxis categories are not supported on a SciChartPolarSurface`
            );
        }

        this.categoriesProperty.push({ name, values, axisType: resolvedAxisType, axisOptions });
    }

    /**
     * Creates or rebuilds the category Y axes, DataSeries and RenderableSeries from the current categories.
     * Call again after changing categories or data to update the chart
     */
    public build(): void {
        if (this.categoriesProperty.length === 0) {
            throw new Error("Add at least one category with addCategory() before calling build()");
        }
        const xAxis = this.sciChartSurface.getDefaultXAxis();
        if (!xAxis) {
            throw new Error("Add an X axis to the SciChartSurface before calling build()");
        }
        this.isBuilding = true;
        // Invalidate the hit-test spline cache: the record geometry (or category order) is about to change.
        this.dataVersion++;
        try {
            this.xAxisProperty = xAxis;
            const categoriesCount = this.categoriesProperty.length;
            const recordsCount = this.categoriesProperty[0].values.length;

            // Only apply the default X range when the user has not set one on the axis, so a caller can
            // control the horizontal padding/zoom (e.g. new NumericAxis(wasmContext, { visibleRange })).
            const useDefaultXRange = xAxis.hasDefaultVisibleRange();
            if (this.isPolar) {
                // x = i lands at radial axis i's angle, x = categoriesCount closes the full circle
                if (useDefaultXRange) {
                    xAxis.visibleRange = new NumberRange(0, categoriesCount);
                }
                if (this.startAngle !== undefined) {
                    (xAxis as PolarAxisBase).startAngle = this.startAngle;
                }
                // category names around the perimeter, radar-style (radial axis titles would overlap)
                xAxis.labelProvider = new TextLabelProvider({
                    labels: this.categoriesProperty.map((category) => category.name),
                });
                xAxis.autoTicks = false;
                xAxis.majorDelta = 1;
            } else if (useDefaultXRange) {
                xAxis.visibleRange = new NumberRange(-0.5, categoriesCount - 0.5);
            }

            this.updateUniqueValuesMaps();
            this.normalizationRanges = this.categoriesProperty.map((_, index) => this.deriveVisibleRange(index));

            const expectedSeriesCount = this.useSingleSeries ? 1 : recordsCount;
            const canUpdateInPlace =
                this.yAxesProperty.length === categoriesCount &&
                this.renderableSeriesProperty.length === expectedSeriesCount;
            if (!canUpdateInPlace) {
                this.teardown();
            }

            this.ensureHiddenYAxis();
            this.ensureLayoutStrategy();

            if (canUpdateInPlace) {
                this.updateAxesInPlace();
                if (this.useSingleSeries) {
                    this.updateSingleSeriesInPlace();
                } else {
                    this.updateSeriesInPlace();
                }
            } else {
                this.createAxes();
                if (this.useSingleSeries) {
                    this.createSingleSeries();
                } else {
                    this.createSeries();
                }
            }

            // Keep the visible category axes consistent with the hidden axis, in case it was
            // left zoomed/panned from a previous build
            this.syncCategoryAxesToHidden();
            // Re-apply the selection overlay so it tracks the (possibly reordered) category positions.
            this.rebuildSelectionOverlay();
        } finally {
            this.isBuilding = false;
            // const rs0 = this.renderableSeries[0] as FastLineRenderableSeries;
            // for (let i=0; i<rs0.dataSeries.count(); i++) {
            //     console.log('x ', rs0.getNativeXValues().get(i), "y ", rs0.getNativeYValues().get(i));
            // }
        }
    }

    /**
     * Synonym of {@link build}
     */
    public invalidate(): void {
        this.build();
    }

    /**
     * Moves the category (dimension) at {@link fromIndex} to {@link toIndex}, shifting the others, then
     * rebuilds. Because the category axes and the record x-values are both derived positionally from the
     * category order (axis at group position i, record vertex at x = i), this reorders both the axes and the
     * polylines. Used by the drag-to-reorder modifier. No-op if the indexes are equal or out of range.
     */
    public moveCategory(fromIndex: number, toIndex: number): void {
        const count = this.categoriesProperty.length;
        if (fromIndex < 0 || fromIndex >= count || toIndex < 0 || toIndex >= count || fromIndex === toIndex) {
            return;
        }
        const [moved] = this.categoriesProperty.splice(fromIndex, 1);
        this.categoriesProperty.splice(toIndex, 0, moved);
        this.build();
    }

    /**
     * Returns the category Y axis with the given id. The axis id defaults to the category name
     */
    public getYAxisById(id: string): AxisBase2D | undefined {
        return this.yAxesProperty.find((axis) => axis.id === id);
    }

    /**
     * Returns the renderable series with the given id. The series id defaults to `pcp-series-${recordIndex}`
     */
    public getRenderableSeriesById(id: string): IRenderableSeries | undefined {
        return this.renderableSeriesProperty.find((series) => series.id === id);
    }

    /**
     * When true, all records are drawn by one renderable series (see {@link IParallelCoordinateDataSourceOptions.useSingleSeries}).
     * Per-record modifiers such as ParallelCoordinatePlotHighlightModifier require this to be false
     */
    public get isSingleSeriesMode(): boolean {
        return this.useSingleSeries;
    }

    /**
     * The custom hit-test for range selection on one category axis: iterates just the values of the category
     * at the given index and returns the indexes of the records whose value falls inside the inclusive range
     * [min, max]. For {@link EAxisType.CategoryAxis} categories the range is in unique-value-index space
     * (the same space the category axis' coordinate calculator works in).
     * @param categoryIndex The index of the category (Y axis) to test
     * @param min The lower bound of the selected range, as a raw data value on that axis
     * @param max The upper bound of the selected range, as a raw data value on that axis
     */
    public getRecordIndexesInRange(categoryIndex: number, min: number, max: number): number[] {
        const category = this.categoriesProperty[categoryIndex];
        if (!category) {
            return [];
        }
        const rangeMin = Math.min(min, max);
        const rangeMax = Math.max(min, max);
        const recordIndexes: number[] = [];
        category.values.forEach((rawValue, recordIndex) => {
            const numericValue = this.getNumericValue(categoryIndex, rawValue);
            if (numericValue >= rangeMin && numericValue <= rangeMax) {
                recordIndexes.push(recordIndex);
            }
        });
        return recordIndexes;
    }

    /**
     * In single-series mode ({@link useSingleSeries}), maps a data-point index (e.g. the
     * {@link SeriesInfo.dataSeriesIndex} of a cursor hit) back to the record it belongs to. Records are laid
     * out as fixed-size blocks separated by one NaN gap point, so this is `Math.floor(index / recordStride)`.
     * Returns -1 in multi-series mode, or when the index does not correspond to a valid record.
     */
    public getRecordIndexForPoint(pointIndex: number): number {
        if (!this.useSingleSeries || this.categoriesProperty.length === 0 || pointIndex < 0) {
            return -1;
        }
        const recordsCount = this.categoriesProperty[0].values.length;
        const recordIndex = Math.floor(pointIndex / this.getRecordStride());
        return recordIndex >= 0 && recordIndex < recordsCount ? recordIndex : -1;
    }

    /**
     * Fast click hit-test for single-series record selection. Returns the index of the record polyline nearest
     * the canvas pixel (mouseX, mouseY) within hitTestRadius pixels, or -1.
     *
     * The renderable-series hit-test recomputes the whole spline (~records * interpolationPoints points) and
     * scans every segment on every call - far too slow at 100k+ records. This exploits the parallel-coordinate
     * layout instead: category vertices sit at fixed x = 0..K-1 and the spline subdivides each inter-axis band
     * into `interpolationPoints + 1` equal-width columns, so:
     *   1. the click's column is found from x alone in O(1); then
     *   2. only that one column's segment is measured per record - O(records) of plain arithmetic.
     * Record r's category c maps to on-screen vertex `(r * stride + c) * intPoints2` (verified against
     * {@link SplineRenderDataTransform} / CubicSplineEval), so the segment endpoints are direct indexed reads.
     * The spline values are cached and only recomputed when the visible range or data changes
     * (see {@link ensureSplineValuesFresh}), so repeated clicks in place cost nothing extra.
     */
    public hitTestRecord(mouseX: number, mouseY: number, hitTestRadius: number): number {
        const categoriesCount = this.categoriesProperty.length;
        const series = this.renderableSeriesProperty[0];
        if (categoriesCount < 2 || !series || !this.xAxisProperty || !this.hiddenYAxis) {
            return -1;
        }
        const point = translateFromCanvasToSeriesViewRect(
            new Point(mouseX, mouseY),
            this.sciChartSurface.seriesViewRect
        );
        if (!point) {
            return -1;
        }
        const xCalc = this.xAxisProperty.getCurrentCoordinateCalculator();
        const yCalc = this.hiddenYAxis.getCurrentCoordinateCalculator();
        if (!xCalc || !yCalc) {
            return -1;
        }

        const isSpline = series instanceof SplineLineRenderableSeries && series.interpolationPoints > 0;
        const intPoints2 = isSpline ? series.interpolationPoints + 1 : 1;
        // Source of on-screen Y: the interpolated spline vertices (spline mode) or the raw data Y (straight
        // lines). Both are laid out as record blocks of `stride` input points; the spline expands each input
        // point into `intPoints2` output vertices, so the two layouts share one index formula below.
        let yValues: { get(index: number): number };
        if (isSpline) {
            this.ensureSplineValuesFresh(series);
            try {
                yValues = series.ySplineValues;
            } catch {
                return -1;
            }
        } else {
            yValues = series.getNativeYValues();
        }
        if (!yValues || yValues.get === undefined) {
            return -1;
        }

        // 1) Locate the column (sub-segment) the click lands in, from x only. Columns tile [0, K-1] uniformly.
        const totalColumns = (categoriesCount - 1) * intPoints2;
        const xData = xCalc.getDataValue(point.x);
        const column = Math.max(0, Math.min(totalColumns - 1, Math.floor(xData * intPoints2)));
        const band = Math.floor(column / intPoints2);
        const step = column - band * intPoints2;

        // Column x-endpoints are identical for every record - compute once. Linearize the (linear, numeric)
        // hidden Y axis so the per-record loop needs no coordinate-calculator calls.
        const xLeftPx = xCalc.getCoordinate(band + step / intPoints2);
        const xRightPx = xCalc.getCoordinate(band + (step + 1) / intPoints2);
        const yAtZero = yCalc.getCoordinate(0);
        const yScale = yCalc.getCoordinate(1) - yAtZero;

        // 2) Measure point-to-segment distance to that one column per record. O(records).
        const stride = this.getRecordStride();
        const recordsCount = this.categoriesProperty[0].values.length;
        let nearestRecord = -1;
        let nearestDistanceSq = hitTestRadius * hitTestRadius;
        for (let r = 0; r < recordsCount; r++) {
            const leftIndex = (r * stride + band) * intPoints2 + step;
            const yLeftPx = yAtZero + yValues.get(leftIndex) * yScale;
            const yRightPx = yAtZero + yValues.get(leftIndex + 1) * yScale;
            const distanceSq = distanceToSegmentSq(point.x, point.y, xLeftPx, yLeftPx, xRightPx, yRightPx);
            if (distanceSq < nearestDistanceSq) {
                nearestDistanceSq = distanceSq;
                nearestRecord = r;
            }
        }
        return nearestRecord;
    }

    /**
     * Ensures the series' on-screen spline values ({@link SplineLineRenderableSeries.ySplineValues}) are current
     * for {@link hitTestRecord}. The normal draw path computes the spline into a discarded local, so the cached
     * values only reflect the last {@link SplineLineRenderableSeries.updateSplineValues} call and go stale on
     * zoom/pan. Recompute only when the x/y visible range or the data ({@link dataVersion}) has changed since the
     * last hit-test - so clicking repeatedly without panning never recomputes the spline.
     */
    private ensureSplineValuesFresh(series: SplineLineRenderableSeries): void {
        const xRange = this.xAxisProperty.visibleRange;
        const yRange = this.hiddenYAxis.visibleRange;
        const isFresh =
            this.splineCacheDataVersion === this.dataVersion &&
            this.splineCacheXRange !== undefined &&
            this.splineCacheYRange !== undefined &&
            this.splineCacheXRange.min === xRange.min &&
            this.splineCacheXRange.max === xRange.max &&
            this.splineCacheYRange.min === yRange.min &&
            this.splineCacheYRange.max === yRange.max;
        if (isFresh) {
            return;
        }
        series.updateSplineValues();
        this.splineCacheDataVersion = this.dataVersion;
        this.splineCacheXRange = { min: xRange.min, max: xRange.max };
        this.splineCacheYRange = { min: yRange.min, max: yRange.max };
    }

    /**
     * Single-series mode only: highlight the given records (keep their colour, dim all others) by updating the
     * single palette provider, then repaint. Pass undefined to clear the highlight. No-op when there is no
     * single palette provider (multi-series mode, or single-series without per-record colours).
     */
    public highlightRecords(recordIndexes: number[] | undefined): void {
        if (!this.singlePaletteProvider) {
            return;
        }
        this.singlePaletteProvider.setHighlight(recordIndexes ? new Set(recordIndexes) : undefined);
        this.sciChartSurface.invalidateElement();
    }

    /**
     * Single-series mode: draws the given record as a separate renderable series on top of the base series,
     * in that record's own colour at full opacity and double the base stroke thickness, so a click-selected
     * record stands out against the faint base lines. Pass undefined to clear.
     *
     * Uses {@link buildRecordData} and {@link createSeriesFn} so the overlay matches the base geometry
     * (including spline interpolation). The overlay is a standalone series kept out of {@link renderableSeries},
     * so it never affects hit-testing, build/teardown or the single palette provider.
     */
    public setSelectedRecordOverlay(recordIndex: number | undefined): void {
        this.selectionOverlayRecordIndex = recordIndex !== undefined && recordIndex >= 0 ? recordIndex : undefined;
        this.rebuildSelectionOverlay();
        this.sciChartSurface.invalidateElement();
    }

    /**
     * (Re)creates the selection overlay series for the current {@link selectionOverlayRecordIndex}. Called on
     * selection and again after every {@link build} so the overlay follows the record's reordered geometry.
     */
    private rebuildSelectionOverlay(): void {
        if (this.selectionOverlaySeries) {
            this.sciChartSurface.renderableSeries.remove(this.selectionOverlaySeries);
            this.selectionOverlaySeries = undefined;
        }
        const recordIndex = this.selectionOverlayRecordIndex;
        if (recordIndex === undefined || this.categoriesProperty.length === 0 || !this.xAxisProperty) {
            return;
        }
        const userOptions = this.createSeriesFn?.(recordIndex) ?? {};
        const { xValues, yValues, metadata } = this.buildRecordData(recordIndex);
        const dataSeries = new XyDataSeries(this.webAssemblyContext, {
            dataSeriesName: "pcp-selection-overlay",
            xValues,
            yValues,
            metadata,
        });
        // Same colour (lineOptions carries the record's stroke), but forced to full opacity and double thickness.
        const { interpolationPoints, opacity, strokeThickness, ...lineOptions } = userOptions;
        const seriesOptions: IFastLineRenderableSeriesOptions = {
            ...lineOptions,
            id: "pcp-selection-overlay",
            xAxisId: this.xAxisProperty.id,
            yAxisId: PCP_HIDDEN_YAXIS_ID,
            dataSeries,
            opacity: 1,
            strokeThickness: (strokeThickness ?? 1) * 2,
            pointMarker: this.createPointMarker(userOptions.stroke),
        };
        this.selectionOverlaySeries = this.isPolar
            ? new PolarLineRenderableSeries(this.webAssemblyContext, seriesOptions)
            : interpolationPoints > 0
            ? new SplineLineRenderableSeries(this.webAssemblyContext, { ...seriesOptions, interpolationPoints })
            : new FastLineRenderableSeries(this.webAssemblyContext, seriesOptions);
        this.sciChartSurface.renderableSeries.add(this.selectionOverlaySeries);
    }

    /** @inheritDoc */
    public delete(): void {
        if (this.selectionOverlaySeries) {
            this.sciChartSurface.renderableSeries.remove(this.selectionOverlaySeries);
            this.selectionOverlaySeries = undefined;
        }
        this.selectionOverlayRecordIndex = undefined;
        this.teardown();
        if (this.hiddenRangeUnsubscribe) {
            this.hiddenRangeUnsubscribe();
            this.hiddenRangeUnsubscribe = undefined;
        }
        if (this.hiddenYAxis) {
            this.sciChartSurface.yAxes.remove(this.hiddenYAxis);
            this.hiddenYAxis = undefined;
        }
        this.categoriesProperty = [];
        this.uniqueValuesMaps = [];
        this.normalizationRanges = [];
        this.xAxisProperty = undefined;
        this.singlePaletteProvider = undefined;
    }

    /**
     * Normalizes a raw category value into the coordinate space of the hidden Y axis (0..1),
     * using the fixed build-time {@link normalizationRanges} (not the live axis visibleRange,
     * which changes on zoom/pan)
     */
    protected normalizeValue(categoryIndex: number, rawValue: number | string): number {
        const category = this.categoriesProperty[categoryIndex];
        const range = this.normalizationRanges[categoryIndex];
        const numericValue = this.getNumericValue(categoryIndex, rawValue);
        const isLogarithmic = category.axisType === EAxisType.LogarithmicAxis;
        const transform = (value: number) => (isLogarithmic ? Math.log(value) : value);
        const transformedMin = transform(range.min);
        const transformedMax = transform(range.max);
        let normalized =
            transformedMax === transformedMin
                ? 0.5
                : (transform(numericValue) - transformedMin) / (transformedMax - transformedMin);
        if (this.isCategoryFlipped(categoryIndex)) {
            normalized = 1 - normalized;
        }
        return normalized;
    }

    /**
     * The inverse of {@link normalizeValue}: converts a normalized coordinate (0..1) back to a raw data value
     * using the fixed build-time {@link normalizationRanges}. Used to derive each category axis' visibleRange
     * from the hidden axis when zooming/panning
     */
    protected denormalizeValue(categoryIndex: number, normalized: number): number {
        const category = this.categoriesProperty[categoryIndex];
        const range = this.normalizationRanges[categoryIndex];
        const fraction = this.isCategoryFlipped(categoryIndex) ? 1 - normalized : normalized;
        if (category.axisType === EAxisType.LogarithmicAxis) {
            const logMin = Math.log(range.min);
            const logMax = Math.log(range.max);
            return Math.exp(logMin + fraction * (logMax - logMin));
        }
        return range.min + fraction * (range.max - range.min);
    }

    private isCategoryFlipped(categoryIndex: number): boolean {
        return this.yAxesProperty[categoryIndex]?.flippedCoordinates ?? false;
    }

    /**
     * Converts a raw category value to a numeric value.
     * For CategoryAxis-type categories this is the index of the unique value
     */
    protected getNumericValue(categoryIndex: number, rawValue: number | string): number {
        const uniqueValues = this.uniqueValuesMaps[categoryIndex];
        if (uniqueValues) {
            return uniqueValues.get(String(rawValue));
        }
        return rawValue as number;
    }

    private updateUniqueValuesMaps(): void {
        this.uniqueValuesMaps = this.categoriesProperty.map((category) => {
            if (category.axisType !== EAxisType.CategoryAxis) {
                return undefined;
            }
            const map = new Map<string, number>();
            category.values.forEach((value) => {
                const key = String(value);
                if (!map.has(key)) {
                    map.set(key, map.size);
                }
            });
            return map;
        });
    }

    private deriveVisibleRange(categoryIndex: number): NumberRange {
        const category = this.categoriesProperty[categoryIndex];
        const overriddenRange = category.axisOptions?.visibleRange;
        if (overriddenRange) {
            return new NumberRange(overriddenRange.min, overriddenRange.max);
        }
        if (category.axisType === EAxisType.CategoryAxis) {
            const uniqueCount = this.uniqueValuesMaps[categoryIndex].size;
            return uniqueCount > 1 ? new NumberRange(0, uniqueCount - 1) : new NumberRange(-0.5, 0.5);
        }
        const values = category.values as number[];
        let min = Math.min(...values);
        let max = Math.max(...values);
        if (category.axisType === EAxisType.LogarithmicAxis) {
            if (min <= 0) {
                throw new Error(`Category "${category.name}" uses LogarithmicAxis and requires positive values`);
            }
            // Apply padding multiplicatively, which is linear padding in log space
            const factor = min === max ? 1 + this.rangePadding : Math.pow(max / min, this.rangePadding);
            return new NumberRange(min / factor, max * factor);
        }
        if (min === max) {
            const padding = Math.abs(min) * this.rangePadding || this.rangePadding;
            return new NumberRange(min - padding, max + padding);
        }
        const padding = (max - min) * this.rangePadding;
        return new NumberRange(min - padding, max + padding);
    }

    private ensureHiddenYAxis(): void {
        if (this.hiddenYAxis) {
            return;
        }
        const hiddenAxisOptions = {
            id: PCP_HIDDEN_YAXIS_ID,
            isVisible: false,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0 - this.yGrowBy.min, 1 + this.yGrowBy.max),
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
        };
        this.hiddenYAxis = this.isPolar
            ? new PolarNumericAxis(this.webAssemblyContext, {
                  ...hiddenAxisOptions,
                  polarAxisMode: EPolarAxisMode.Radial,
              })
            : new NumericAxis(this.webAssemblyContext, hiddenAxisOptions);
        this.sciChartSurface.yAxes.add(this.hiddenYAxis);

        // The hidden axis is what zoom/pan modifiers act on (it is the default Y axis the series bind to).
        // When its range changes, derive each visible category axis' range from it so the axis ticks stay
        // aligned with the record lines.
        const handler = () => {
            if (!this.isBuilding) {
                this.syncCategoryAxesToHidden();
            }
        };
        this.hiddenYAxis.visibleRangeChanged.subscribe(handler);
        this.hiddenRangeUnsubscribe = () => this.hiddenYAxis?.visibleRangeChanged.unsubscribe(handler);
    }

    /**
     * Derives every visible category axis' visibleRange from the hidden axis' current range, so that the record
     * lines (drawn against the hidden axis) stay aligned with the category axis ticks under zoom and pan.
     */
    protected syncCategoryAxesToHidden(): void {
        if (!this.hiddenYAxis) {
            return;
        }
        const { min: hiddenMin, max: hiddenMax } = this.hiddenYAxis.visibleRange;
        this.yAxesProperty.forEach((axis, categoryIndex) => {
            const a = this.denormalizeValue(categoryIndex, hiddenMin);
            const b = this.denormalizeValue(categoryIndex, hiddenMax);
            axis.visibleRange = new NumberRange(Math.min(a, b), Math.max(a, b));
        });
    }

    private ensureLayoutStrategy(): void {
        // Polar surfaces need no layout changes: the PolarLayoutManager already draws
        // every radial axis at its own startAngle
        if (this.isPolar || this.layoutStrategy) {
            return;
        }
        this.layoutStrategy = new ParallelCoordinatesInnerAxisLayoutStrategy({
            orthogonalAxisId: this.xAxisProperty.id,
        });
        this.sciChartSurface.layoutManager.leftInnerAxesLayoutStrategy = this.layoutStrategy;
    }

    /**
     * The angle (radians) of the radial category axis with the given index, derived from the angular X axis
     * so radial axes stay aligned with the polyline vertices
     */
    protected getDimensionAngle(categoryIndex: number): number {
        const xAxis = this.xAxisProperty as PolarAxisBase;
        const direction = xAxis.flippedCoordinates ? -1 : 1;
        return xAxis.startAngle + (direction * (categoryIndex * xAxis.totalAngle)) / this.categoriesProperty.length;
    }

    private createAxes(): void {
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const axis = this.createDimensionAxis(category, categoryIndex);
            this.yAxesProperty.push(axis);
            this.sciChartSurface.yAxes.add(axis);
        });
    }

    private createDimensionAxis(category: IParallelCoordinateCategory, categoryIndex: number): AxisBase2D {
        let axis: AxisBase2D;
        if (this.isPolar) {
            // No axisTitle by default: radial axis titles overlap each other,
            // the category names are drawn as angular axis labels instead
            axis = new PolarNumericAxis(this.webAssemblyContext, {
                ...category.axisOptions,
                id: category.axisOptions?.id ?? category.name,
                polarAxisMode: EPolarAxisMode.Radial,
                startAngle: this.getDimensionAngle(categoryIndex),
                autoRange: EAutoRange.Never,
            });
        } else {
            const axisOptions: IAxisBase2dOptions = {
                axisTitle: category.name,
                ...category.axisOptions,
                id: category.axisOptions?.id ?? category.name,
                axisAlignment: EAxisAlignment.Left,
                isInnerAxis: true,
                autoRange: EAutoRange.Never,
            };
            axis =
                category.axisType === EAxisType.LogarithmicAxis
                    ? new LogarithmicAxis(this.webAssemblyContext, axisOptions)
                    : new NumericAxis(this.webAssemblyContext, axisOptions);
        }
        this.configureDimensionAxis(axis, category, categoryIndex);
        return axis;
    }

    private configureDimensionAxis(
        axis: AxisBase2D,
        category: IParallelCoordinateCategory,
        categoryIndex: number
    ): void {
        axis.visibleRange = this.normalizationRanges[categoryIndex];
        if (category.axisType === EAxisType.CategoryAxis) {
            const labels = Array.from(this.uniqueValuesMaps[categoryIndex].keys());
            axis.labelProvider = new TextLabelProvider({ labels });
            axis.autoTicks = false;
            axis.majorDelta = 1;
        } else {
            // Reset the CategoryAxis styling: axis objects are reused positionally across reorders/rebuilds
            // (updateAxesInPlace), so an axis that previously hosted a CategoryAxis category would otherwise
            // keep its TextLabelProvider + autoTicks=false and show no numeric labels once a numeric category
            // is moved onto it.
            axis.labelProvider = new NumericLabelProvider();
            axis.autoTicks = category.axisOptions?.autoTicks ?? true;
        }
    }

    private updateAxesInPlace(): void {
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const axis = this.yAxesProperty[categoryIndex];
            if (!this.isPolar) {
                axis.axisTitle = category.axisOptions?.axisTitle ?? category.name;
            }
            this.configureDimensionAxis(axis, category, categoryIndex);
        });
    }

    private createSeries(): void {
        const recordsCount = this.categoriesProperty[0].values.length;
        for (let recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
            const series = this.createRenderableSeries(recordIndex);
            this.renderableSeriesProperty.push(series);
            this.sciChartSurface.renderableSeries.add(series);
        }
    }

    private createRenderableSeries(recordIndex: number): IRenderableSeries {
        const userOptions = this.createSeriesFn?.(recordIndex) ?? {};
        const { xValues, yValues, metadata } = this.buildRecordData(recordIndex);
        const dataSeries = new XyDataSeries(this.webAssemblyContext, {
            dataSeriesName: `pcp-series-${recordIndex}`,
            xValues,
            yValues,
            metadata,
        });
        const { interpolationPoints, ...lineOptions } = userOptions;
        const seriesOptions: IFastLineRenderableSeriesOptions = {
            ...lineOptions,
            id: userOptions.id ?? `pcp-series-${recordIndex}`,
            xAxisId: this.xAxisProperty.id,
            yAxisId: PCP_HIDDEN_YAXIS_ID,
            dataSeries,
            // Ellipse marker coloured to match this record's line (when pointMarkerSize is set)
            pointMarker: this.createPointMarker(userOptions.stroke),
        };
        if (this.isPolar) {
            // interpolationPoints is not supported on polar; use interpolateLine in createSeriesFn for arcs
            return new PolarLineRenderableSeries(this.webAssemblyContext, seriesOptions);
        }
        if (interpolationPoints > 0) {
            return new SplineLineRenderableSeries(this.webAssemblyContext, {
                ...seriesOptions,
                interpolationPoints,
            });
        }
        return new FastLineRenderableSeries(this.webAssemblyContext, seriesOptions);
    }

    private buildRecordData(recordIndex: number): {
        xValues: number[];
        yValues: number[];
        metadata: TParallelPointMetadata[];
    } {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const metadata: TParallelPointMetadata[] = [];
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const rawValue = category.values[recordIndex];
            xValues.push(categoryIndex);
            yValues.push(this.normalizeValue(categoryIndex, rawValue));
            metadata.push({ isSelected: false, value: rawValue, category: category.name, recordIndex });
        });
        if (this.isPolar && this.closeLoop) {
            // close the radar polygon by repeating the first category value at the full circle position
            const firstCategory = this.categoriesProperty[0];
            const rawValue = firstCategory.values[recordIndex];
            xValues.push(this.categoriesProperty.length);
            yValues.push(this.normalizeValue(0, rawValue));
            metadata.push({ isSelected: false, value: rawValue, category: firstCategory.name, recordIndex });
        }
        return { xValues, yValues, metadata };
    }

    private updateSeriesInPlace(): void {
        this.renderableSeriesProperty.forEach((series, recordIndex) => {
            const { xValues, yValues, metadata } = this.buildRecordData(recordIndex);
            const dataSeries = series.dataSeries as XyDataSeries;
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues, metadata);
        });
    }

    /** Single-series mode: create one renderable series backed by all records concatenated with NaN gaps */
    private createSingleSeries(): void {
        const userOptions = this.createSeriesFn?.(0) ?? {};
        const { xValues, yValues, metadata } = this.buildAllRecordsData();
        const dataSeries = new XyDataSeries(this.webAssemblyContext, {
            dataSeriesName: "pcp-series",
            xValues,
            yValues,
            metadata,
            // Records are concatenated with NaN gaps and each record's X restarts at 0, so the
            // combined series is neither NaN-free nor monotonic in X.
            containsNaN: true,
            dataIsSortedInX: false,
        });
        // When records carry per-record stroke colours, colour each polyline via a single palette provider
        // (one renderable series cannot otherwise draw more than one stroke colour).
        const colorInfo = this.buildRecordColors();
        if (colorInfo) {
            this.singlePaletteProvider = new ParallelCoordinatePaletteProvider();
            this.singlePaletteProvider.setColors(colorInfo.recordColors, colorInfo.recordStride);
        }
        const { interpolationPoints, opacity, ...lineOptions } = userOptions;
        const seriesOptions: IFastLineRenderableSeriesOptions = {
            // Resampling assumes X is sorted, which is not true once records are concatenated; disable it
            // by default (a handful of points per record makes resampling pointless anyway).
            resamplingMode: EResamplingMode.None,
            ...lineOptions,
            id: userOptions.id ?? "pcp-series",
            xAxisId: this.xAxisProperty.id,
            yAxisId: PCP_HIDDEN_YAXIS_ID,
            dataSeries,
            paletteProvider: this.singlePaletteProvider,
            // With a palette the per-record opacity is baked into the stroke colour's alpha (see
            // buildRecordColors), so leave series opacity at its default to avoid dropping or double-applying it.
            // Without a palette, apply the shared series opacity as usual.
            ...(this.singlePaletteProvider ? {} : { opacity }),
        };
        const series = this.isPolar
            ? new PolarLineRenderableSeries(this.webAssemblyContext, seriesOptions)
            : interpolationPoints > 0
            ? new SplineLineRenderableSeries(this.webAssemblyContext, { ...seriesOptions, interpolationPoints })
            : new FastLineRenderableSeries(this.webAssemblyContext, seriesOptions);
        this.renderableSeriesProperty.push(series);
        this.sciChartSurface.renderableSeries.add(series);
    }

    private updateSingleSeriesInPlace(): void {
        const { xValues, yValues, metadata } = this.buildAllRecordsData();
        const dataSeries = this.renderableSeriesProperty[0].dataSeries as XyDataSeries;
        dataSeries.clear();
        dataSeries.appendRange(xValues, yValues, metadata);
        const colorInfo = this.buildRecordColors();
        if (colorInfo && this.singlePaletteProvider) {
            this.singlePaletteProvider.setColors(colorInfo.recordColors, colorInfo.recordStride);
        }
    }

    /**
     * The number of data points each record occupies in the single combined series, including the trailing
     * NaN gap point that separates records. Used to map a data-point index back to its record.
     */
    private getRecordStride(): number {
        const pointsPerRecord = this.categoriesProperty.length + (this.isPolar && this.closeLoop ? 1 : 0);
        return pointsPerRecord + 1;
    }

    private buildRecordColors(): { recordColors: Uint32Array; recordStride: number } | undefined {
        const recordsCount = this.categoriesProperty[0].values.length;
        const sharedOptions = this.createSeriesFn?.(0) ?? {};
        const sharedStroke = sharedOptions.stroke;
        const sharedOpacity = sharedOptions.opacity;
        // The palette resolves each vertex's record from its point metadata (see ParallelCoordinatePaletteProvider);
        // recordStride is only a fallback for the (non-spline) case where metadata is unavailable, so the raw
        // per-record stride is correct here.
        const recordStride = this.getRecordStride();
        // Cache parsed colours: a large dataset typically uses only a handful of distinct stroke/opacity pairs
        const colorCache = new Map<string, number>();
        const resolveArgb = (stroke: string | undefined, opacity: number | undefined): number | undefined => {
            if (!stroke) {
                return undefined;
            }
            // A palette stroke overrides the series opacity, so bake opacity into the colour's alpha channel.
            // parseColorToUIntArgb's opacity override is a 0-255 byte, while the series opacity option is 0-1.
            const alphaByte = opacity === undefined ? undefined : Math.round(Math.max(0, Math.min(1, opacity)) * 255);
            const key = `${stroke}|${alphaByte ?? ""}`;
            let argb = colorCache.get(key);
            if (argb === undefined) {
                argb = parseColorToUIntArgb(stroke, alphaByte);
                colorCache.set(key, argb);
            }
            return argb;
        };
        const recordColors = new Uint32Array(recordsCount);
        let hasColors = false;
        for (let recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
            const options = this.createSeriesFn?.(recordIndex) ?? {};
            const argb = resolveArgb(options.stroke ?? sharedStroke, options.opacity ?? sharedOpacity);
            if (argb !== undefined) {
                recordColors[recordIndex] = argb;
                hasColors = true;
            }
        }
        return hasColors ? { recordColors, recordStride } : undefined;
    }

    /**
     * Builds every record's points into a single set of arrays, inserting a NaN point between records
     * so the single renderable series draws each record as a separate (broken) polyline
     */
    private buildAllRecordsData(): {
        xValues: number[];
        yValues: number[];
        metadata: TParallelPointMetadata[];
    } {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const metadata: TParallelPointMetadata[] = [];
        const recordsCount = this.categoriesProperty[0].values.length;
        for (let recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
            if (recordIndex > 0) {
                // Gap point that breaks the line between consecutive records. Only y must be NaN to break the
                // line; x is kept finite (0, an in-range category position) because SciChart assumes X values
                // never contain NaN - a NaN here makes the axis' getXRange collapse to (0,0) for the unsorted
                // combined series, breaking zoom-to-extents on the X axis.
                xValues.push(0);
                yValues.push(NaN);
                metadata.push({ isSelected: false, value: NaN, category: "", recordIndex: -1 });
            }
            const record = this.buildRecordData(recordIndex);
            for (let i = 0; i < record.xValues.length; i++) {
                xValues.push(record.xValues[i]);
                yValues.push(record.yValues[i]);
                metadata.push(record.metadata[i]);
            }
        }
        return { xValues, yValues, metadata };
    }

    private teardown(): void {
        this.renderableSeriesProperty.forEach((series) => this.sciChartSurface.renderableSeries.remove(series));
        this.renderableSeriesProperty = [];
        this.yAxesProperty.forEach((axis) => this.sciChartSurface.yAxes.remove(axis));
        this.yAxesProperty = [];
    }
}

/** Squared distance (px^2) from point (px, py) to the line segment (ax, ay)-(bx, by). */
const distanceToSegmentSq = (px: number, py: number, ax: number, ay: number, bx: number, by: number): number => {
    const abx = bx - ax;
    const aby = by - ay;
    const lengthSq = abx * abx + aby * aby;
    // Project (px,py) onto the segment, clamping t to [0,1] so we measure to the nearest endpoint past the ends.
    let t = lengthSq > 0 ? ((px - ax) * abx + (py - ay) * aby) / lengthSq : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const dx = px - (ax + t * abx);
    const dy = py - (ay + t * aby);
    return dx * dx + dy * dy;
};
