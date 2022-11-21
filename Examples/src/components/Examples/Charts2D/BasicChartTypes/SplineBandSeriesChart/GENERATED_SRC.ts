export const code = `import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import classes from "../../../../Examples/Examples.module.scss";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { SplineBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/SplineBandRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ScaleAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";
import {appTheme} from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, growBy: new NumberRange(0.2, 0.2) })
    );

    // The spline bandseries requires a special dataseries type called XyyDataSeries
    // This stores X, Y1, Y2 point data for the two lines in the band
    const yValues = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 13);
    const y1Values = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 12);
    const dataSeries = new XyyDataSeries(wasmContext);

    for (let i = 0; i < 10; i++) {
        const index = i * 100;
        dataSeries.append(yValues.xValues[index], yValues.yValues[index], y1Values.yValues[index]);
    }

    // Create the band series and add to the chart
    const rendSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 3,
        interpolationPoints: 20, // Choose the number of points to interpolate for smoothing
        pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9, fill: appTheme.PaleSkyBlue, stroke: appTheme.VividSkyBlue }),
        animation: new ScaleAnimation({ duration: 800, zeroLine: 0, fadeEffect: true })
    });

    rendSeries.fill = appTheme.VividOrange + "33";
    rendSeries.fillY1 = appTheme.VividSkyBlue + "33";
    rendSeries.stroke = appTheme.VividOrange;
    rendSeries.strokeY1 = appTheme.VividSkyBlue;
    sciChartSurface.renderableSeries.add(rendSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function SplineBandSeriesChart() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;