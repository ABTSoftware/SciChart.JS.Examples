import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { SciChartSurface } from "scichart";
import { NumberRange } from "scichart/Core/NumberRange";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    const yValues: number[] = [
        0.1,
        0.2,
        0.4,
        0.8,
        1.1,
        1.5,
        2.4,
        4.6,
        8.1,
        11.7,
        14.4,
        16.0,
        13.7,
        10.1,
        6.4,
        3.5,
        2.5,
        1.4,
        0.4,
        0.1,
    ];

    // Append them to a dataSeries
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < yValues.length; i++) {
        dataSeries.append(i, yValues[i]);
    }

    // Create an add a column series
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.5)",
        stroke: "rgba(176, 196, 222, 1)",
        strokeThickness: 2,
        dataPointWidth: 0.7,
        dataSeries,
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

export default function ColumnChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
