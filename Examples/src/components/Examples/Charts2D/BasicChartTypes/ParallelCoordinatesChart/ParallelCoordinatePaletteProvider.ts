import type { IPointMetadata } from "scichart";
import type { IStrokePaletteProvider } from "scichart";
import { EStrokePaletteMode } from "scichart";
import type { IRenderableSeries } from "scichart";
import type { TParallelPointMetadata } from "./ParallelCoordinateDataSource";

/**
 * A stroke {@link IStrokePaletteProvider} used by {@link ParallelCoordinateDataSource} in single-series mode to
 * colour each record's polyline independently, even though every record is drawn by one renderable series.
 * @remarks
 * In single-series mode the data source concatenates all records into one {@link XyDataSeries}, where each record
 * contributes a fixed number of points followed by a single NaN gap point. Because that layout is regular, the
 * record a given point belongs to is `Math.floor(index / recordStride)` (recordStride = points-per-record + 1 gap),
 * so this provider only needs one colour per record rather than one per point. The per-vertex callback is therefore
 * a division plus an array lookup. It reports {@link isRangeIndependant} = true and only recomputes when
 * {@link setColors} marks it dirty, so paletting does not re-run on zoom/pan.
 */
export class ParallelCoordinatePaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public isRangeIndependant: boolean = true;

    /** One ARGB colour per record */
    private recordColors: Uint32Array = new Uint32Array(0);
    /** Number of data points each record occupies in the combined series, including its trailing NaN gap point */
    private recordStride: number = 1;
    private isDirty: boolean = true;

    /** When set, these records are drawn in {@link highlightStrokeArgb}; all others keep their own colour. */
    private highlightedRecords: Set<number> | undefined;
    /**
     * ARGB stroke used for highlighted records so a selection stands out by colour. Light grey (a bit darker
     * than white). Not pure white: a pure-white palette override (0xFFFFFFFF) is the shader's "use default"
     * sentinel and is silently ignored.
     */
    private highlightStrokeArgb: number = 0xffd3d3d3;

    /**
     * Sets the per-record ARGB colours and the record stride (points-per-record including the NaN gap).
     * Marks the palette dirty so it is recomputed on the next render.
     */
    public setColors(recordColors: Uint32Array, recordStride: number): void {
        this.recordColors = recordColors;
        this.recordStride = Math.max(1, recordStride);
        this.isDirty = true;
    }

    /**
     * Highlights the given subset of records by drawing them in {@link highlightStrokeArgb} while every other
     * record keeps its own colour untouched. Pass undefined to clear. Marks the palette dirty.
     */
    public setHighlight(highlightedRecords: Set<number> | undefined): void {
        this.highlightedRecords = highlightedRecords;
        this.isDirty = true;
    }

    /** @inheritDoc */
    public onAttached(parentSeries: IRenderableSeries): void {}

    /** @inheritDoc */
    public onDetached(): void {}

    /** @inheritDoc */
    public shouldUpdatePalette(): boolean {
        if (this.isDirty) {
            this.isDirty = false;
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        // Resolve the record from the point metadata. The spline render transform maps each interpolated vertex
        // back to its source data point (SplineRenderDataTransform.populateSourceIndexes), so the metadata (and
        // `index`) are the correct source point for both FastLine and spline series. Fall back to the stride
        // mapping only if metadata is missing.
        const recordIndex = (metadata as TParallelPointMetadata)?.recordIndex ?? Math.floor(index / this.recordStride);
        if (recordIndex < 0 || recordIndex >= this.recordColors.length) {
            return undefined;
        }
        // Highlighted records render in the highlight stroke (light grey); everyone else keeps their own colour.
        return this.highlightedRecords?.has(recordIndex) ? this.highlightStrokeArgb : this.recordColors[recordIndex];
    }
}
