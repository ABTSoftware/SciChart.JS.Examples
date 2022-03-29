import { IFillPaletteProvider, EStrokePaletteMode, EFillPaletteMode } from "scichart/Charting/Model/IPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

export class PaletteRange {
    public startIndex: number;
    public endIndex: number;
    public fill: string;

    constructor(startIndex: number, endIndex: number, fill: string) {
        if (startIndex > endIndex) {
            throw new Error("startIndex shouldn't be greater than endIndex!");
        }

        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.fill = fill;
    }
}

export class RangeFillPaletteProvider implements IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private paletteRanges: PaletteRange[];


    constructor(paletteRanges: PaletteRange[]) {
        this.paletteRanges = paletteRanges;
    }

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void { }

    // tslint:disable-next-line:no-empty
    public onDetached(): void { }

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: IPointMetadata
    ): number {
        const currentRange = this.paletteRanges.find((range) => range.startIndex <= index && range.endIndex >= index);
        return currentRange ? parseColorToUIntArgb(currentRange.fill) : undefined;
    }
}