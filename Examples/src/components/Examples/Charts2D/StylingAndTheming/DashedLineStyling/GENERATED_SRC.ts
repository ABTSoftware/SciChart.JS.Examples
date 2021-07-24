export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TSciChart } from "scichart/types/TSciChart";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import classes from "../../../../Examples/Examples.module.scss";

// tslint:disable:no-empty
// tslint:disable:max-classes-per-file

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Decimal }));

    // Create YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Create a Mountain series with a dashed line
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(70,130,180,0.4)", offset: 0 },
                { color: "rgba(70,130,180,0.0)", offset: 0.5 }
            ]),
            strokeThickness: 3,
            dataSeries: createLineData(wasmContext, 2),
            // Strokedash array defines the stroke dash. [10,5] means draw for 10pts, gap for 5pts
            strokeDashArray: [10, 5]
        })
    );

    // Create a line series with a dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 1),
            // Strokedash array defines the stroke dash. [3,3] means draw for 3pts, gap for 3pts
            strokeDashArray: [3, 3]
        })
    );

    // Create a line series a dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 0),
            // Strokedash array defines the stroke dash. [2,2] means draw for 2pt, gap for 2pt
            strokeDashArray: [2, 2]
        })
    );

    // Create a band series with dashed lines and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: createBandData(wasmContext),
            strokeThickness: 2,
            fill: "rgba(70,130,180,0.2)",
            fillY1: "rgba(70,130,180,0.2)",
            stroke: "SteelBlue",
            strokeY1: "SteelBlue"
            // strokeDashArray: [10, 10],
            // strokeY1DashArray: [3, 3]
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

// Creates some dummy data and appends into an XyDataSeries for the example
const createLineData = (wasmContext: TSciChart, whichSeries: number) => {
    const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);
    const xyDataSeries = new XyDataSeries(wasmContext);

    xyDataSeries.appendRange(
        data.xValues,
        data.yValues.map(y => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5))
    );
    return xyDataSeries;
};

const createBandData = (wasmContext: TSciChart) => {
    const data0 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const xyyDataSeries = new XyyDataSeries(wasmContext);
    xyyDataSeries.appendRange(data0.xValues, data0.yValues, data1.yValues);
    return xyyDataSeries;
};

export default function DashedLineStyling() {
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
`;