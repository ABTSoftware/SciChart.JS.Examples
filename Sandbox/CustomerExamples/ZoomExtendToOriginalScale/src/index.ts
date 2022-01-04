import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { NumberRange } from 'scichart/Core/NumberRange';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { EAutoRange } from 'scichart/types/AutoRange';
import { EXyDirection } from 'scichart/types/XyDirection';
import { CustomMouseWheelZoomModifier } from './CustomMouseWheelZoomModifier';

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(100, 200),
        autoRange: EAutoRange.Never,
        zoomExtentsToInitialRange: true
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-0.25, 4),
        autoRange: EAutoRange.Never
    });
    sciChartSurface.yAxes.add(yAxis);

    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < 1000; i++) {
        xValues.push(i);
        yValues.push((Math.sin(i) + 1) * (1 + i / 1000));
    }

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        })
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    // The order of chart modifiers matters, because modifiers set args.handled = true
    // to avoid handling same events twice by different modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new CustomMouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection })
    );
}

initSciChart();
