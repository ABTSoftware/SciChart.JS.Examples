import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { DefaultPaletteProvider, EStrokePaletteMode } from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { NumberRange } from 'scichart/Core/NumberRange';

export const drawExampleLine = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id');

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
class LinePaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        // Conditional logic for coloring here. Returning 'undefined' means 'use default renderableSeries.stroke'
        // else, we can return a color of choice.
        //
        // Note that colors returned are Argb format as number. There are helper functions which can convert from Html
        // color codes to Argb format.
        //
        // Performance considerations: overrideStrokeArgb is called per-point on the series when drawing.
        // Caching color values and doing minimal logic in this function will help performance
        return this.rule(yValue) ? this.stroke : undefined;
    }
}
