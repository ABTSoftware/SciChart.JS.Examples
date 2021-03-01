import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { getVarianceData } from "./data";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";

// tslint:disable:max-line-length

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Date_DDMMYYYY }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Generates some data for the example as an array of TVarPoint: {
    //     date: number;
    //     actual: number;
    //     varMax: number;
    //     var4: number;
    //     var3: number;
    //     var2: number;
    //     var1: number;
    //     varMin: number;
    // }
    const varianceData = getVarianceData();

    // To render the fan chart, we use a Line Chart with XyDataSeries
    // and three Band charts with XyyDataSeries
    const actualDataSeries = new XyDataSeries(wasmContext);
    const variance3DataSeries = new XyyDataSeries(wasmContext);
    const variance2DataSeries = new XyyDataSeries(wasmContext);
    const variance1DataSeries = new XyyDataSeries(wasmContext);

    actualDataSeries.appendRange(
        varianceData.map(v => v.date),
        varianceData.map(v => v.actual)
    );
    variance3DataSeries.appendRange(
        varianceData.map(v => v.date),
        varianceData.map(v => v.varMin),
        varianceData.map(v => v.varMax)
    );
    variance2DataSeries.appendRange(
        varianceData.map(v => v.date),
        varianceData.map(v => v.var1),
        varianceData.map(v => v.var4)
    );
    variance1DataSeries.appendRange(
        varianceData.map(v => v.date),
        varianceData.map(v => v.var2),
        varianceData.map(v => v.var3)
    );

    // Add a line series with the Xy data (the actual data)
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: actualDataSeries,
            stroke: "Red"
        })
    );

    // Add band series with progressively higher opacity for the fan variance data
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: variance3DataSeries,
            opacity: 0.15,
            fill: "Red",
            strokeY1: "#00000000"
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: variance2DataSeries,
            opacity: 0.33,
            fill: "Red",
            strokeY1: "#00000000"
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: variance1DataSeries,
            opacity: 0.5,
            fill: "Red",
            strokeY1: "#00000000"
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

export default function FanChart() {
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
