export const code = `
import * as React from "react";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";

const divElementId2 = "chart2";

const drawExample = async (): Promise<void> => {
    await drawChart2();
};

const X_VISIBLE_RANGE = new NumberRange(-1, 3);
const Y_VISIBLE_RANGE = new NumberRange(-1, 5);
const X_TITLE = "x axis";
const Y_TITLE = "y = x^2";

// Chart for y = x^2, x in [-2, 2], step 0.1, 40 steps
const xValues: number[] = [];
const yValues: number[] = [];
for (let i = 0; i <= 20; i++) {
    const x = 0.1 * i;
    xValues.push(x);
    yValues.push(x ** 2);
}

const drawChart2 = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId2);

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = X_VISIBLE_RANGE;
    xAxis.axisAlignment = EAxisAlignment.Left;
    xAxis.axisTitle = X_TITLE;
    xAxis.growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = Y_VISIBLE_RANGE;
    yAxis.axisAlignment = EAxisAlignment.Top;
    yAxis.axisTitle = Y_TITLE;
    yAxis.growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: "#ff6600",
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier({ isHorizontal: true }));

    sciChartSurface.zoomExtents();
};

export default function VerticalCharts() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId2} style={{ maxWidth: 900 }} />;
}

`;
