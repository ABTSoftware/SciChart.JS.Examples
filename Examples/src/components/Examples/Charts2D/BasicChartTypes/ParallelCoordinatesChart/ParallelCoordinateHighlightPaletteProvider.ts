import type { IStrokePaletteProvider } from "scichart";
import { EStrokePaletteMode } from "scichart";
import type { IRenderableSeries } from "scichart";
import { parseColorToUIntArgb } from "scichart";

/**
 * The highlight state of one record series while a {@link ParallelCoordinatePlotHighlightModifier}
 * range selection is active
 */
export enum EParallelHighlightState {
    /** No highlight is active; the series renders with its own styling (the palette returns undefined) */
    None = "None",
    /** A highlight is active and this record passes through the selected range */
    Highlighted = "Highlighted",
    /** A highlight is active and this record does NOT pass through the selected range */
    Dimmed = "Dimmed",
}

/**
 * A stroke {@link IStrokePaletteProvider} attached by {@link ParallelCoordinatePlotHighlightModifier} to each
 * record series of a multi-series Parallel Coordinate Plot.
 * @remarks
 * While a range highlight is active, records outside the selected range are dimmed (the series' own stroke with
 * its alpha multiplied down) and records inside it are drawn at the highlighted opacity. With no highlight active
 * every per-vertex callback returns undefined, so the user's own styling (stroke, opacity, hover/selection
 * effects) shows through untouched.
 *
 * Note that a colour returned by a stroke palette replaces the series-level opacity, so both the dimmed and
 * highlighted opacities are baked into the returned colour's alpha channel (the dimmed alpha additionally
 * multiplies in the series' own opacity, so dimming is relative to how the record normally looks).
 *
 * The palette is range-independent and only recomputes when {@link setHighlightState} changes the state,
 * so paletting does not re-run on zoom/pan.
 */
export class ParallelCoordinateHighlightPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public isRangeIndependant: boolean = true;

    private parentSeries: IRenderableSeries | undefined;
    private state: EParallelHighlightState = EParallelHighlightState.None;
    /** The ARGB colour the whole series is drawn with, or undefined for the series' natural styling */
    private overrideArgb: number | undefined;
    private isDirty: boolean = true;

    /**
     * Sets this series' highlight state and the opacities to apply, and marks the palette dirty
     * so it is recomputed on the next render
     * @param state The highlight state of this record
     * @param dimmedOpacity Multiplier (0..1) applied to the series' own opacity when {@link EParallelHighlightState.Dimmed}
     * @param highlightedOpacity Stroke alpha (0..1) used when {@link EParallelHighlightState.Highlighted}
     */
    public setHighlightState(state: EParallelHighlightState, dimmedOpacity: number, highlightedOpacity: number): void {
        this.state = state;
        this.overrideArgb = this.computeOverrideArgb(dimmedOpacity, highlightedOpacity);
        this.isDirty = true;
    }

    /** @inheritDoc */
    public onAttached(parentSeries: IRenderableSeries): void {
        this.parentSeries = parentSeries;
        this.isDirty = true;
    }

    /** @inheritDoc */
    public onDetached(): void {
        this.parentSeries = undefined;
    }

    /** @inheritDoc */
    public shouldUpdatePalette(): boolean {
        if (this.isDirty) {
            this.isDirty = false;
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    public overrideStrokeArgb(): number | undefined {
        return this.overrideArgb;
    }

    private computeOverrideArgb(dimmedOpacity: number, highlightedOpacity: number): number | undefined {
        const stroke = this.parentSeries?.stroke;
        if (this.state === EParallelHighlightState.None || !stroke) {
            return undefined;
        }
        const alpha =
            this.state === EParallelHighlightState.Highlighted
                ? highlightedOpacity
                : (this.parentSeries.opacity ?? 1) * dimmedOpacity;
        const alphaByte = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
        return parseColorToUIntArgb(stroke, alphaByte);
    }
}
