import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { NumberRange } from 'scichart/Core/NumberRange';
import { DragSeriesModifier } from './DragSeriesModifier';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from 'scichart/types/AnchorPoint';

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0) });

    const yAxis1 = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { color: 'white' },
        visibleRange: new NumberRange(0, 8)
    });

    const yAxis2Id = 'yAxis2Id';
    const yAxis2 = new NumericAxis(wasmContext, {
        id: yAxis2Id,
        axisAlignment: EAxisAlignment.Right,
        labelStyle: { color: 'red' },
        visibleRange: new NumberRange(0, 8)
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis1);
    sciChartSurface.yAxes.add(yAxis2);

    const customAnnotation1 = new CustomAnnotation({
        x1: 1,
        y1: 3,
        // isEditable: true,
        xCoordShift: 0,
        yCoordShift: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: `<svg id="two" width="50" height="50"  xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" style="fill:white"><animate attributeName="rx" values="0;25;0" dur="2s" repeatCount="indefinite" color="#ffffff" /></rect>
            </svg>`
    });

    const customAnnotation2 = new CustomAnnotation({
        yAxisId: yAxis2Id,
        x1: 1,
        y1: 5,
        xCoordShift: 0,
        yCoordShift: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: `<svg id="two" width="50" height="50"  xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" style="fill:red"><animate attributeName="rx" values="0;25;0" dur="2s" repeatCount="indefinite" color="#ffffff" /></rect>
            </svg>`
    });

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [3, 4, 3, 4, 3],
            dataSeriesName: 'white'
        })
    });

    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        yAxisId: yAxis2Id,
        stroke: 'red',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [5, 6, 5, 5, 4, 3],
            dataSeriesName: 'red'
        })
    });

    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2);
    sciChartSurface.annotations.add(customAnnotation1, customAnnotation2);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new DragSeriesModifier({ annotations: [customAnnotation1, customAnnotation2] }));
}

initSciChart();
