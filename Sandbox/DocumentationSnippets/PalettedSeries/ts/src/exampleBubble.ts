import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyzDataSeries } from 'scichart/Charting/Model/XyzDataSeries';
import { FastBubbleRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';

export const drawExampleBubble = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.07, 0.07) }));

    const bubbleDataSeries = new XyzDataSeries(wasmContext);
    const POINTS = 20;
    let prevYValue = 0;
    for (let i = 0; i < POINTS; i++) {
        const curYValue = Math.sin(i) * 10 - 5;
        const size = Math.sin(i) * 60 + 3;
        bubbleDataSeries.append(i, prevYValue + curYValue, size);
        prevYValue += curYValue;
    }

    // Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: bubbleDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 0,
            fill: '#4682b4',
            opacity: 0.5
        }),
        paletteProvider: new BubblesPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    sciChartSurface.zoomExtents();
};

class BubblesPaletteProvider implements IPointMarkerPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private redFill = parseColorToUIntArgb('#FF0000');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overridePointMarkerArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): TPointMarkerArgb {
        return xValue >= 8 && xValue <= 12 ? { stroke: undefined, fill: this.redFill } : undefined;
    }
}
