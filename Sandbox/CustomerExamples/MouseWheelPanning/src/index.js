import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {RangeSelectionChartModifier} from "./RangeSelectionChartModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {EXyDirection} from "scichart/types/XyDirection";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {EClipMode} from "scichart/Charting/Visuals/Axis/AxisBase2D";

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
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Create some data and set on a line series
    const xyData = new XyDataSeries(wasmContext);
    for(let i = 0; i < 250; i++) {
        xyData.append(i, Math.sin(i*0.1));
    }
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries: xyData }));

    // Add a custom modifier to select ranges
    // sciChartSurface.chartModifiers.add(new RangeSelectionChartModifier());

    const mouseWheelModifier = new MouseWheelZoomModifier();
    mouseWheelModifier.modifierMouseWheel = (args) => {
        const delta = args.mouseWheelDelta * 0.1;
        mouseWheelModifier.parentSurface.xAxes.asArray().forEach(x => {
            x.scroll(delta, EClipMode.None);
        });
    };
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier( { xyDirection: EXyDirection.XDirection }));
    sciChartSurface.chartModifiers.add(mouseWheelModifier);
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
}

initSciChart();
