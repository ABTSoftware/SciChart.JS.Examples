import {
    IRenderableSeries,
    parseColorToUIntArgb,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
} from "scichart";
import { SunburstMetadata } from "./SunburstMetadata";

export class SunburstPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: SunburstMetadata
    ): number {
        if (metadata.isSelected) {
            return metadata.colorArgbWithOpacity;
        } else {
            return metadata.colorArgb;
        }
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: SunburstMetadata
    ): number {
        return undefined;
    }
}
