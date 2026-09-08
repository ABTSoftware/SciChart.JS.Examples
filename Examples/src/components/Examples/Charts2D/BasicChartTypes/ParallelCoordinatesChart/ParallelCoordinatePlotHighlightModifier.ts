import { Point } from "scichart";
import type { IRubberBandXyZoomModifierOptions } from "scichart";
import { RubberBandXyZoomModifier } from "scichart";
import type { ModifierMouseArgs } from "scichart";
import type { ParallelCoordinateDataSource } from "./ParallelCoordinateDataSource";
import {
    EParallelHighlightState,
    ParallelCoordinateHighlightPaletteProvider,
} from "./ParallelCoordinateHighlightPaletteProvider";

/**
 * The arguments passed to {@link IParallelCoordinatePlotHighlightModifierOptions.onHighlightChanged}
 * when a range highlight is applied
 */
export type TParallelHighlightChangedArgs = {
    /** The index of the category (Y axis) the range was selected on */
    categoryIndex: number;
    /** The lower bound of the selected range, as a raw data value on that axis */
    min: number;
    /** The upper bound of the selected range, as a raw data value on that axis */
    max: number;
    /** The indexes of the records passing through the selected range */
    recordIndexes: number[];
};

/**
 * Optional parameters used to configure a {@link ParallelCoordinatePlotHighlightModifier} at construct time
 */
export interface IParallelCoordinatePlotHighlightModifierOptions extends IRubberBandXyZoomModifierOptions {
    /**
     * Multiplier (0..1) applied to a record's own opacity when it falls outside the selected range,
     * while a highlight is active. Default 0.15
     */
    dimmedOpacity?: number;
    /**
     * The stroke alpha (0..1) used for records inside the selected range, while a highlight is active. Default 1
     */
    highlightedOpacity?: number;
    /**
     * Called when the highlight changes: with the selected axis/range/records when a range is selected,
     * or with undefined when the highlight is cleared
     */
    onHighlightChanged?: (args: TParallelHighlightChangedArgs | undefined) => void;
}

/**
 * @summary A chart modifier that highlights the records of a Parallel Coordinate Plot passing through
 * a range selected on one category Y axis
 * @description
 * Drag a rubber-band rectangle over one of the category axes: the x extent of the rectangle determines
 * which category axis is selected (the axis position nearest the centre of the dragged x range), and the
 * y extent is converted through that axis' own coordinate calculator into a raw value range. A custom
 * hit-test ({@link ParallelCoordinateDataSource.getRecordIndexesInRange}) then iterates just that category's
 * values, and every record series is paletted via {@link ParallelCoordinateHighlightPaletteProvider}:
 * records passing through the range keep full colour, all others are dimmed. Click (without dragging)
 * to clear the highlight.
 *
 * Works only with a multi-series {@link ParallelCoordinateDataSource} (the default,
 * `useSingleSeries: false`), because per-record palette state requires one renderable series per record.
 *
 * ```ts
 * const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface);
 * // ... addCategory / build ...
 * sciChartSurface.chartModifiers.add(new ParallelCoordinatePlotHighlightModifier(data));
 * ```
 */
export class ParallelCoordinatePlotHighlightModifier extends RubberBandXyZoomModifier {
    /**
     * Multiplier (0..1) applied to a record's own opacity when it falls outside the selected range,
     * while a highlight is active
     */
    public dimmedOpacity: number;
    /**
     * The stroke alpha (0..1) used for records inside the selected range, while a highlight is active
     */
    public highlightedOpacity: number;
    /**
     * Called when the highlight changes: with the selected axis/range/records when a range is selected,
     * or with undefined when the highlight is cleared
     */
    public onHighlightChanged: ((args: TParallelHighlightChangedArgs | undefined) => void) | undefined;

    private readonly dataSource: ParallelCoordinateDataSource;
    private highlightedRecordIndexesProperty: number[] | undefined;

    /**
     * Creates an instance of a ParallelCoordinatePlotHighlightModifier
     * @param dataSource The {@link ParallelCoordinateDataSource} to highlight records of. Must be multi-series
     * @param options Optional parameters used to configure the modifier
     */
    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinatePlotHighlightModifierOptions) {
        super(options);
        if (dataSource.isSingleSeriesMode) {
            throw new Error(
                "ParallelCoordinatePlotHighlightModifier only works with a multi-series ParallelCoordinateDataSource (useSingleSeries: false), because it palettes one renderable series per record"
            );
        }
        this.dataSource = dataSource;
        this.dimmedOpacity = options?.dimmedOpacity ?? 0.15;
        this.highlightedOpacity = options?.highlightedOpacity ?? 1;
        this.onHighlightChanged = options?.onHighlightChanged;
    }

    /**
     * The indexes of the currently highlighted records, or undefined when no highlight is active
     */
    public get highlightedRecordIndexes(): number[] | undefined {
        return this.highlightedRecordIndexesProperty;
    }

    /**
     * Clears the highlight, restoring every record's own styling
     */
    public clearHighlight(): void {
        const hadHighlight = this.highlightedRecordIndexesProperty !== undefined;
        this.highlightedRecordIndexesProperty = undefined;
        this.dataSource.renderableSeries.forEach((series) => {
            const provider = series.paletteProvider;
            if (provider instanceof ParallelCoordinateHighlightPaletteProvider) {
                provider.setHighlightState(EParallelHighlightState.None, this.dimmedOpacity, this.highlightedOpacity);
            }
        });
        if (hadHighlight) {
            this.onHighlightChanged?.(undefined);
            this.parentSurface?.invalidateElement();
        }
    }

    /**
     * @inheritDoc
     */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        const wasDragging = this.isClicked;
        super.modifierMouseUp(args);
        // A click (drag below the rubber-band sensitivity) clears the highlight. isClicked flipping to false
        // means the base class accepted and processed this mouse-up (execute conditions matched).
        if (
            wasDragging &&
            !this.isClicked &&
            this.pointFrom &&
            this.pointTo &&
            this.calculateDraggedDistance() <= RubberBandXyZoomModifier.MIN_DRAG_SENSITIVITY
        ) {
            this.clearHighlight();
        }
    }

    /**
     * @inheritDoc
     */
    public onDetach(): void {
        this.clearHighlight();
        super.onDetach();
    }

    /**
     * Overridden to perform the range highlight instead of zooming. No axis range is changed
     * @param pointFrom the first corner of the dragged rectangle, relative to the seriesViewRect
     * @param pointTo the second corner of the dragged rectangle, relative to the seriesViewRect
     */
    protected performZoom(pointFrom: Point, pointTo: Point): void {
        const categoryIndex = this.getCategoryIndexForXRange(pointFrom.x, pointTo.x);
        if (categoryIndex === undefined) {
            // The dragged x range contains no category axis position: treat as "select nothing"
            this.clearHighlight();
            return;
        }
        // Convert the y pixel range through the selected category axis' own calculator, so the range is in
        // that axis' raw data space at any zoom/pan level (and for logarithmic / flipped axes)
        const yCalc = this.dataSource.yAxes[categoryIndex].getCurrentCoordinateCalculator();
        const value1 = yCalc.getDataValue(pointFrom.y);
        const value2 = yCalc.getDataValue(pointTo.y);
        this.highlightRange(categoryIndex, Math.min(value1, value2), Math.max(value1, value2));
    }

    /**
     * Highlights the records passing through the given raw-value range on the category axis with the
     * given index, dimming all other records. Called by the rubber-band gesture, but can also be called
     * programmatically
     * @param categoryIndex The index of the category (Y axis) to select on
     * @param min The lower bound of the selected range, as a raw data value on that axis
     * @param max The upper bound of the selected range, as a raw data value on that axis
     */
    public highlightRange(categoryIndex: number, min: number, max: number): void {
        const recordIndexes = this.dataSource.getRecordIndexesInRange(categoryIndex, min, max);
        this.applyHighlight({ categoryIndex, min, max, recordIndexes });
    }

    /**
     * Uses a dragged x coordinate range (pixels relative to the seriesViewRect) to find which category
     * Y axis to work on: category axes sit at x data positions 0..K-1, so this returns the position inside
     * the dragged x data range nearest to its centre, or undefined when no axis position falls inside the range
     */
    public getCategoryIndexForXRange(xFrom: number, xTo: number): number | undefined {
        const xAxis = this.parentSurface.getDefaultXAxis();
        const xCalc = xAxis.getCurrentCoordinateCalculator();
        const dataValue1 = xCalc.getDataValue(xFrom);
        const dataValue2 = xCalc.getDataValue(xTo);
        const rangeMin = Math.min(dataValue1, dataValue2);
        const rangeMax = Math.max(dataValue1, dataValue2);
        const rangeCenter = (rangeMin + rangeMax) / 2;
        let nearestIndex: number | undefined;
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (let categoryIndex = 0; categoryIndex < this.dataSource.yAxes.length; categoryIndex++) {
            if (categoryIndex < rangeMin || categoryIndex > rangeMax) {
                continue;
            }
            const distance = Math.abs(categoryIndex - rangeCenter);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = categoryIndex;
            }
        }
        return nearestIndex;
    }

    private applyHighlight(args: TParallelHighlightChangedArgs): void {
        const selected = new Set(args.recordIndexes);
        this.dataSource.renderableSeries.forEach((series, recordIndex) => {
            const existing = series.paletteProvider;
            const provider =
                existing instanceof ParallelCoordinateHighlightPaletteProvider
                    ? existing
                    : new ParallelCoordinateHighlightPaletteProvider();
            if (provider !== existing) {
                series.paletteProvider = provider;
            }
            provider.setHighlightState(
                selected.has(recordIndex) ? EParallelHighlightState.Highlighted : EParallelHighlightState.Dimmed,
                this.dimmedOpacity,
                this.highlightedOpacity
            );
        });
        this.highlightedRecordIndexesProperty = args.recordIndexes;
        this.onHighlightChanged?.(args);
        this.parentSurface.invalidateElement();
    }
}
