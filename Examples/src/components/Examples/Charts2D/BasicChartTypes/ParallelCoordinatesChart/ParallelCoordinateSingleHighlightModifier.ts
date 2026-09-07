import { Point } from "scichart";
import type { IRubberBandXyZoomModifierOptions } from "scichart";
import { RubberBandXyZoomModifier } from "scichart";
import type { ModifierMouseArgs } from "scichart";
import type { ParallelCoordinateDataSource } from "./ParallelCoordinateDataSource";

/**
 * Optional parameters used to configure a {@link ParallelCoordinateSingleHighlightModifier}
 */
export interface IParallelCoordinateSingleHighlightModifierOptions extends IRubberBandXyZoomModifierOptions {}

/**
 * @summary Range-highlight modifier for a single-series Parallel Coordinate Plot.
 * @description
 * The single-series counterpart to {@link ParallelCoordinatePlotHighlightModifier}. Drag a rubber band over one
 * category Y axis: the records whose value on that axis falls inside the dragged y range are highlighted and all
 * others dimmed. Because single-series mode draws every record as one renderable series, the highlight is applied
 * through the palette provider ({@link ParallelCoordinateDataSource.highlightRecords}) rather than per-series
 * palettes. Click (without dragging) clears the highlight.
 */
export class ParallelCoordinateSingleHighlightModifier extends RubberBandXyZoomModifier {
    private readonly dataSource: ParallelCoordinateDataSource;
    private hasHighlight: boolean = false;

    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinateSingleHighlightModifierOptions) {
        super(options);
        this.dataSource = dataSource;
    }

    /** Overridden to highlight records in the dragged range instead of zooming. */
    protected performZoom(pointFrom: Point, pointTo: Point): void {
        const categoryIndex = this.getCategoryIndexForXRange(pointFrom.x, pointTo.x);
        if (categoryIndex === undefined) {
            this.clearHighlight();
            return;
        }
        const yCalc = this.dataSource.yAxes[categoryIndex].getCurrentCoordinateCalculator();
        const value1 = yCalc.getDataValue(pointFrom.y);
        const value2 = yCalc.getDataValue(pointTo.y);
        const records = this.dataSource.getRecordIndexesInRange(
            categoryIndex,
            Math.min(value1, value2),
            Math.max(value1, value2)
        );
        this.dataSource.highlightRecords(records);
        this.hasHighlight = true;
    }

    /** @inheritDoc */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        const wasDragging = this.isClicked;
        super.modifierMouseUp(args);
        // A click (drag below the rubber-band sensitivity) clears the highlight.
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
     * The category axis nearest the centre of the dragged x range (axes sit at x data positions 0..K-1), or
     * undefined when the range contains no axis position.
     */
    private getCategoryIndexForXRange(xFrom: number, xTo: number): number | undefined {
        const xAxis = this.parentSurface.getDefaultXAxis();
        const xCalc = xAxis.getCurrentCoordinateCalculator();
        const rangeMin = Math.min(xCalc.getDataValue(xFrom), xCalc.getDataValue(xTo));
        const rangeMax = Math.max(xCalc.getDataValue(xFrom), xCalc.getDataValue(xTo));
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

    private clearHighlight(): void {
        if (this.hasHighlight) {
            this.hasHighlight = false;
            this.dataSource.highlightRecords(undefined);
        }
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /** Clear the highlight when disabled. */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        if (!value) {
            this.clearHighlight();
        }
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.clearHighlight();
        super.onDetach();
    }
}
