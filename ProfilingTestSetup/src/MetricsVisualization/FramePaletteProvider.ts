import {
    IStrokePaletteProvider,
    IFillPaletteProvider,
    EStrokePaletteMode,
    EFillPaletteMode,
    parseColorToUIntArgb,
    IRenderableSeries,
    CustomChartModifier2D,
    IChartModifierBaseOptions,
    EChart2DModifierType,
    EPaletteProviderType
} from "scichart";

export class FramePaletteProvider implements IFillPaletteProvider {
    public customType = "FramePaletteProvider";
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly palettedStroke = parseColorToUIntArgb("#E5DFFD", 128);
    private readonly palettedFill = parseColorToUIntArgb("#758aaeff", 128);

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        if (index % 2) {
            return this.palettedFill;
        } else {
            return this.palettedStroke;
        }
    }

    // public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
    //     if (xValue >= 400 && xValue <= 500) {
    //         return this.palettedStroke;
    //     } else {
    //         return undefined;
    //     }
    // }
}
