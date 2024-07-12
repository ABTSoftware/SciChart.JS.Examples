import {
    OhlcDataSeries,
    IRenderableSeries,
    IPointMetadata,
    parseColorToUIntArgb,
    EFillPaletteMode,
    IFillPaletteProvider,
} from "scichart";

// Class which manages red/green fill colouring on Volume column series depending on if the candle is up or down
export class VolumePaletteProvider implements IFillPaletteProvider {
    fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private ohlcDataSeries: OhlcDataSeries;
    private upColorArgb: number;
    private downColorArgb: number;

    constructor(masterData: OhlcDataSeries, upColor: string, downColor: string) {
        this.upColorArgb = parseColorToUIntArgb(upColor);
        this.downColorArgb = parseColorToUIntArgb(downColor);
        this.ohlcDataSeries = masterData;
    }

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    // Return up or down color for the volume bars depending on Ohlc data
    overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const isUpCandle =
            this.ohlcDataSeries.getNativeOpenValues().get(index) >=
            this.ohlcDataSeries.getNativeCloseValues().get(index);
        return isUpCandle ? this.upColorArgb : this.downColorArgb;
    }

    // Return up or down color for the volume bars depending on Ohlc data
    overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const isUpCandle =
            this.ohlcDataSeries.getNativeOpenValues().get(index) >=
            this.ohlcDataSeries.getNativeCloseValues().get(index);
        return isUpCandle ? this.upColorArgb : this.downColorArgb;
    }
}
