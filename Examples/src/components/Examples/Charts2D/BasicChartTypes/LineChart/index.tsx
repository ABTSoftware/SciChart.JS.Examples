import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { PaletteFactory } from "scichart/Charting/Model/PaletteFactory";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { GradientParams } from "scichart/Core/GradientParams";
import { NumberRange } from "scichart/Core/NumberRange";
import { Point } from "scichart/Core/Point";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#ff6600" });
    lineSeries.strokeThickness = 5;
    sciChartSurface.renderableSeries.add(lineSeries);
    lineSeries.stroke = "white";

    lineSeries.paletteProvider = PaletteFactory.createGradient(
        wasmContext,
        new GradientParams(new Point(0, 0), new Point(1, 1), [
            { color: "red", offset: 0 },
            { color: "pink", offset: 0.2 },
            { color: "yellow", offset: 0.5 },
            { color: "purple", offset: 0.7 },
            { color: "green", offset: 1 }
        ])
    );

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }
    lineSeries.dataSeries = dataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

export default function LineChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
