import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { CategoryAxis } from 'scichart/Charting/Visuals/Axis/CategoryAxis';
import { SmartDateLabelProvider } from 'scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider';
import { NumberRange } from 'scichart/Core/NumberRange';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { OhlcDataSeries } from 'scichart/Charting/Model/OhlcDataSeries';
import { openValues, highValues, lowValues, dateValues, closeValues } from './exampleCandleData';
import { FastCandlestickRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries';
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
import { SciChartJSDarkTheme } from 'scichart/Charting/Themes/SciChartJSDarkTheme';

export const drawExampleCandle = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSDarkTheme()
    });
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.labelProvider = new SmartDateLabelProvider();
    xAxis.growBy = new NumberRange(0.05, 0.05);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1.1, 1.2);
    yAxis.growBy = new NumberRange(0.1, 0.1);
    yAxis.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues: dateValues,
        openValues,
        highValues,
        lowValues,
        closeValues
    });
    const renderableSeries = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries,
        dataPointWidth: 0.5,
        brushUp: '#50ff50B2',
        brushDown: '#ff5050B2',
        strokeUp: '#50ff50',
        strokeDown: '#ff5050',
        opacity: 1,
        paletteProvider: new CandlePaletteProvider()
    });
    sciChartSurface.renderableSeries.add(renderableSeries);

    sciChartSurface.zoomExtents();
    return { renderableSeries, sciChartSurface };
};

class CandlePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly greyStroke = parseColorToUIntArgb('grey');
    // Right now we can not use the pure white color #FFFFFF, because it is used as a system color for paletting
    private readonly whiteFill = parseColorToUIntArgb('#FEFEFE');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (yValue <= 1.15 && yValue >= 1.14) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.whiteFill, opacity) : this.whiteFill;
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
        if (yValue <= 1.15 && yValue >= 1.14) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.greyStroke, opacity) : this.greyStroke;
        }
        return undefined;
    }
}
