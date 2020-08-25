import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";

const divElementId = "chart";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Line Series
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#ff6600" });
    lineSeries.strokeThickness = 2;
    sciChartSurface.renderableSeries.add(lineSeries);
    lineSeries.stroke = "white";

    // Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 2,
            fill: "steelblue",
            stroke: "LightSteelBlue",
        }),
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Populate data to both series
    const lineDataSeries = new XyDataSeries(wasmContext);
    const bubbleDataSeries = new XyzDataSeries(wasmContext);
    const POINTS = 20;
    let prevYValue = 0;
    for (let i = 0; i < POINTS; i++) {
        const curYValue = Math.sin(i) * 10 - 5;
        const size = Math.sin(i) * 60 + 3;

        lineDataSeries.append(i, prevYValue + curYValue);
        bubbleDataSeries.append(i, prevYValue + curYValue, size);

        prevYValue += curYValue;
    }

    lineSeries.dataSeries = lineDataSeries;
    bubbleSeries.dataSeries = bubbleDataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
};

export default function BubbleChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
