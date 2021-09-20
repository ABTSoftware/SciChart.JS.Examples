import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAutoRange } from 'scichart/types/AutoRange';
import { FastColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';
import { NumberRange } from 'scichart/Core/NumberRange';

export const drawExampleColumn = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
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

class ColumnPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly limeStroke = parseColorToUIntArgb('lime');
    private readonly yellowFill = parseColorToUIntArgb('yellow');

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (yValue < -0.9 || yValue > 0.9) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        } else {
            return undefined;
        }
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (yValue < -0.9 || yValue > 0.9) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        } else {
            return undefined;
        }
    }
}
