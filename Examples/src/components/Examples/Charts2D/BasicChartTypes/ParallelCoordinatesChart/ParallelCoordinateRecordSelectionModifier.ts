import { ChartModifierBase2D } from "scichart";
import type { IChartModifierBaseOptions } from "scichart";
import type { ModifierMouseArgs } from "scichart";
import type { ParallelCoordinateDataSource } from "./ParallelCoordinateDataSource";

/** Movement (px) below which a mouse-down/up pair counts as a click rather than a drag. */
const CLICK_DRAG_THRESHOLD = 5;

/**
 * Optional parameters used to configure a {@link ParallelCoordinateRecordSelectionModifier}
 */
export interface IParallelCoordinateRecordSelectionModifierOptions extends IChartModifierBaseOptions {
    /** Max pixel distance from a record polyline for a click to select it. Default 10 */
    hitTestRadius?: number;
}

/**
 * @summary Click-to-select a record in a single-series Parallel Coordinate Plot.
 * @description
 * In single-series mode every record is drawn by one renderable series, so the stock
 * {@link SeriesSelectionModifier} (which selects a whole series) cannot pick an individual record. This
 * modifier hit-tests the record polyline nearest the click and highlights it by drawing it as a separate
 * overlay series ({@link ParallelCoordinateDataSource.setSelectedRecordOverlay}): the clicked record is redrawn
 * on top in its own colour at full opacity and double stroke thickness, so it stands out against the faint base
 * lines. Clicking the same record again, or clicking empty space, clears the selection. Selection happens on a
 * click (a mouse-up with negligible drag) so it coexists with the left-drag pan/zoom/reorder modifiers.
 */
export class ParallelCoordinateRecordSelectionModifier extends ChartModifierBase2D {
    public readonly type = "ParallelCoordinateRecordSelection";

    public hitTestRadius: number;

    private readonly dataSource: ParallelCoordinateDataSource;
    private downPoint: { x: number; y: number } | undefined;
    private selectedRecord: number | undefined;

    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinateRecordSelectionModifierOptions) {
        super(options);
        this.dataSource = dataSource;
        this.hitTestRadius = options?.hitTestRadius ?? 10;
    }

    /** @inheritDoc */
    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        this.downPoint = args.mousePoint ? { x: args.mousePoint.x, y: args.mousePoint.y } : undefined;
    }

    /** @inheritDoc */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        const down = this.downPoint;
        this.downPoint = undefined;
        if (!this.checkExecuteConditions(args).isPrimary || !down || !args.mousePoint) {
            return;
        }
        // Ignore drags (pan/zoom/reorder) - only a click selects.
        if (Math.hypot(args.mousePoint.x - down.x, args.mousePoint.y - down.y) > CLICK_DRAG_THRESHOLD) {
            return;
        }

        // Fast parallel-coordinate hit-test: O(records), no spline recompute (see hitTestRecord).
        const record = this.dataSource.hitTestRecord(args.mousePoint.x, args.mousePoint.y, this.hitTestRadius);

        // Toggle the clicked record; clicking a different one replaces it; clicking empty clears.
        this.selectedRecord = record >= 0 && record !== this.selectedRecord ? record : undefined;
        this.applySelection();
    }

    private applySelection(): void {
        this.dataSource.setSelectedRecordOverlay(this.selectedRecord);
    }

    /** The currently selected record index, or undefined. */
    public get selectedRecordIndex(): number | undefined {
        return this.selectedRecord;
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /** Clear the highlight when disabled (no mouse events fire while disabled). */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        // Only clear (and repaint) if a record was actually selected - avoids spurious overlay updates.
        if (!value && this.selectedRecord !== undefined) {
            this.selectedRecord = undefined;
            this.dataSource.setSelectedRecordOverlay(undefined);
        }
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.selectedRecord = undefined;
        this.dataSource.setSelectedRecordOverlay(undefined);
        super.onDetach();
    }
}
