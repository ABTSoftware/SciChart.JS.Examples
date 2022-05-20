import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastImpulseRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastImpulseRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import {
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    IStrokePaletteProvider, TPointMarkerArgb
} from 'scichart/Charting/Model/IPaletteProvider';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { NumberRange } from 'scichart/Core/NumberRange';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';

export const drawExampleImpulse = async (divElementId: string) => {
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
    for (let i = 0; i < 25; i++) {
        dataSeries.append(i, Math.sin(i * 0.05));
    }

    // Create a line series with a PaletteProvider. See implementation of LinePaletteProvider below
    sciChartSurface.renderableSeries.add(
        new FastImpulseRenderableSeries(wasmContext, {
            fill: "SteelBlue",
            strokeThickness: 1,
            dataSeries,
            // The LinePaletteProvider (declared below) implements per-point coloring for line series
            paletteProvider: new LineAndPointMarkerPaletteProvider('#55FF55', yValue => yValue > 0.5)
        })
    );

    sciChartSurface.zoomExtents();
};

/**
 * An example PaletteProvider which implements both IStrokePaletteProvider and IPointMarkerPaletteProvider
 * This can be attached to line, mountain, column or impulse series to change the stroke and pointmarker of the series conditionally
 */
class LineAndPointMarkerPaletteProvider implements IStrokePaletteProvider, IPointMarkerPaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    private stroke: number;
    private rule: (yValue: number) => boolean;

    constructor(stroke: string, rule: (yValue: number) => boolean) {
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    // paletteprovider override for the stroke
    overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.rule(yValue) ? this.stroke : undefined;
    }

    // paletteprovider override for the pointmarker
    overridePointMarkerArgb(xValue: number, yValue: number, index: number): TPointMarkerArgb {
        return this.rule(yValue) ? {
            stroke: this.stroke,
            fill: this.stroke
        } : undefined;
    }
}
