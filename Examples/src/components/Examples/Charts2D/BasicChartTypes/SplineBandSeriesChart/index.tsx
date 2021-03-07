import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import classes from "../../../../Examples/Examples.module.scss";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {SplineBandRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineBandRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, growBy: new NumberRange(0.4, 0.4) })
    );

    // The spline bandseries requires a special dataseries type called XyyDataSeries
    // This stores X, Y1, Y2 point data for the two lines in the band
    const yValues = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 13);
    const y1Values = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 12);
    const dataSeries = new XyyDataSeries(wasmContext);

    for(let i = 0; i < 10; i++) {
        const index = i * 100;
        dataSeries.append(yValues.xValues[index], yValues.yValues[index], y1Values.yValues[index]);
    }

    // Create the band series and add to the chart
    const rendSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 2,
        interpolationPoints: 10, // Choose the number of points to interpolate for smoothing
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#FFFFFF", stroke: "#006400"}),
    });
    rendSeries.fill = "#279B2733";
    rendSeries.fillY1 = "#FF191933";
    rendSeries.stroke = "#FF1919FF";
    rendSeries.strokeY1 = "#279B27FF";
    sciChartSurface.renderableSeries.add(rendSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

export default function SplineBandSeriesChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
