import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import {
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';

export const drawExampleScatter = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 20; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }

    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 40,
            height: 40,
            strokeThickness: 6,
            stroke: '#FF0000',
            fill: '#0000FF',
            opacity: 1
        }),
        paletteProvider: new ScatterPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

class ScatterPaletteProvider implements IPointMarkerPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    private readonly limeStroke = parseColorToUIntArgb('lime');
    private readonly yellowFill = parseColorToUIntArgb('yellow');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overridePointMarkerArgb(xValue: number, yValue: number, index: number): TPointMarkerArgb {
        if (yValue > 0.75) {
            return {
                stroke: this.limeStroke,
                fill: this.yellowFill
            };
        } else {
            return undefined;
        }
    }
}
