import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { NumberRange } from 'scichart/Core/NumberRange';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { UniformHeatmapDataSeries } from 'scichart/Charting/Model/UniformHeatmapDataSeries';
import { UniformHeatmapRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries';
import { HeatmapColorMap } from 'scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap';
import { RolloverModifier } from 'scichart/Charting/ChartModifiers/RolloverModifier';
import { GradientParams } from 'scichart/Core/GradientParams';
import { Point } from 'scichart/Core/Point';
import { PaletteFactory } from 'scichart/Charting/Model/PaletteFactory';
import { IStrokePaletteProvider, EStrokePaletteMode } from 'scichart/Charting/Model/IPaletteProvider';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { EPaletteProviderType } from 'scichart/types/PaletteProviderType';
import { TGradientStop } from 'scichart/types/TGradientStop';

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    const xAxis = new NumericAxis(wasmContext);
    xAxis.axisAlignment = EAxisAlignment.Top;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.axisAlignment = EAxisAlignment.Left;
    yAxis.visibleRange = new NumberRange(0, 120);
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastLineRenderableSeries(wasmContext);
    lineSeries.stroke = "steelBlue";
    lineSeries.strokeThickness = 3;
    const dataSeries = new XyDataSeries(wasmContext);
    const flatDataSeries = new XyDataSeries(wasmContext);
    const heatMapData: number[][] = [[]];
    let i = 0;
    for (let x = 0; x < 10; x += 0.2) {
        let y = 50 + 50 * Math.sin(x);
        dataSeries.append(x, y);
        // Heatmap data usng index
        heatMapData[0][i] = y;
        i++;
        // flat data for heatmap line
        flatDataSeries.append(x, 105);
    }
    lineSeries.dataSeries = dataSeries;

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 0.2,
        yStart: 110,
        yStep: 5,
        zValues: heatMapData,
    });

    const gradientStops: TGradientStop[] = [
        { offset: 0, color: '#00008B' },
        { offset: 0.2, color: '#6495ED' },
        { offset: 0.4, color: '#006400' },
        { offset: 0.6, color: '#7FFF00' },
        { offset: 0.8, color: '#FFFF00' },
        { offset: 1.0, color: '#FF0000' },
    ];

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 100,
            gradientStops
        }),
    });

    const colorData: number[] = PaletteFactory.createColorMap(
        wasmContext,
        gradientStops
    );
    const palette: IStrokePaletteProvider = {
        strokePaletteMode: EStrokePaletteMode.GRADIENT,
        onAttached(parentSeries: IRenderableSeries): void {
        },
        onDetached(): void {},
        overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
            const y = dataSeries.getNativeYValues().get(index);
            const lerpFactor = y / 100;
            const mapIndex = wasmContext.NumberUtil.Constrain(
                Math.round(lerpFactor * (colorData.length - 1)),
                0,
                colorData.length - 1
            );
            const result = colorData[mapIndex];
            return result;
        }
    };
    lineSeries.paletteProvider = palette;

    const heatMapLine = new FastLineRenderableSeries(wasmContext);
    heatMapLine.strokeThickness = 10;
    heatMapLine.stroke = "steelBlue";
    heatMapLine.dataSeries = flatDataSeries;
    heatMapLine.paletteProvider = palette;

    sciChartSurface.renderableSeries.add(lineSeries, heatmapSeries, heatMapLine);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier(), new RolloverModifier());
}

initSciChart();
