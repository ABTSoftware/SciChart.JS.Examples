import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { EStrokePaletteMode, IStrokePaletteProvider } from 'scichart/Charting/Model/IPaletteProvider';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { NumberRange } from 'scichart/Core/NumberRange';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';

export const drawExampleLine = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Create YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 250; i++) {
        dataSeries.append(i, Math.sin(i * 0.05));
    }

    // Create a line series with a PaletteProvider. See implementation of LinePaletteProvider below
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: 'SteelBlue',
            strokeThickness: 5,
            dataSeries,
            // The LinePaletteProvider (declared below) implements per-point coloring for line series
            paletteProvider: new LinePaletteProvider('#55FF55', yValue => yValue > 0.5)
        })
    );

    sciChartSurface.zoomExtents();
};

/**
 * An example PaletteProvider which implements IStrokePaletteProvider.
 * This can be attached to line, mountain, column or candlestick series to change the stroke of the series conditionally
 */
class LinePaletteProvider implements IStrokePaletteProvider {
    // Changing strokePaletteMode to EStrokePaletteMode.GRADIENT will produce gradient color transition
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    private stroke: number;
    private rule: (yValue: number) => boolean;

    constructor(stroke: string, rule: (yValue: number) => boolean) {
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}
