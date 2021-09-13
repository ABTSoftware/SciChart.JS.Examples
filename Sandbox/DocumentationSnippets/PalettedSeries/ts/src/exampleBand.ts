import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyyDataSeries } from 'scichart/Charting/Model/XyyDataSeries';
import { FastBandRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IPointMarkerPaletteProvider,
    IStrokePaletteProvider,
    TPointMarkerArgb
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';

export const drawExampleBand = async (divElementId: string) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.4, 0.4) }));

    const dataSeries = new XyyDataSeries(wasmContext);
    const POINTS = 20;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        const k = 1 - i / 2000;
        const y = Math.sin(i * STEP) * k * 0.7;
        const y1 = Math.cos(i * STEP) * k;
        dataSeries.append(i, y, y1);
    }
    const rendSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 7,
        fill: 'rgba(39,155,39,0.7)',
        fillY1: 'rgba(255,25,25,0.7)',
        stroke: '#FF1919',
        strokeY1: '#279B27',
        opacity: 1,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            strokeThickness: 4,
            stroke: '#FFFF33',
            fill: '#33FF33',
            opacity: 1
        })
    });

    rendSeries.paletteProvider = new BandPaletteProvider();

    sciChartSurface.renderableSeries.add(rendSeries);
    sciChartSurface.zoomExtents();
};

class BandPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider, IPointMarkerPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly limeStroke = parseColorToUIntArgb('lime');
    private readonly yellowFill = parseColorToUIntArgb('rgba(255,255,0,0.7)');
    private readonly markerRedStroke = parseColorToUIntArgb('red');
    private readonly markerBlueFill = parseColorToUIntArgb('blue');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (xValue >= 6 && xValue <= 12) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        }
        return undefined;
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (xValue >= 6 && xValue <= 12) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        }
        return undefined;
    }

    public overridePointMarkerArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): TPointMarkerArgb {
        if (xValue >= 6 && xValue <= 12) return { stroke: this.markerRedStroke, fill: this.markerBlueFill };
        return undefined;
    }
}
