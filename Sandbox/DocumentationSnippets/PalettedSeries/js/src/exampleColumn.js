import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import {
    DefaultPaletteProvider,
    EFillPaletteMode,
    EStrokePaletteMode
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';
import { NumberRange } from 'scichart/Core/NumberRange';

export const drawExampleColumn = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id", {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 20; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: '#FF3333',
        stroke: '#4682b4',
        strokeThickness: 7,
        dataPointWidth: 0.6,
        opacity: 1,
        paletteProvider: new ColumnPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    sciChartSurface.zoomExtents();
};

class ColumnPaletteProvider extends DefaultPaletteProvider {

    constructor() {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.fillPaletteMode = EFillPaletteMode.SOLID;
        this.limeStroke = parseColorToUIntArgb('lime');
        this.yellowFill = parseColorToUIntArgb('yellow');
    }

    overrideFillArgb(xValue, yValue, index, opacity, metadata    ) {
        if (yValue < -0.9 || yValue > 0.9) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        } else {
            return undefined;
        }
    }

    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        if (yValue < -0.9 || yValue > 0.9) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        } else {
            return undefined;
        }
    }
}
