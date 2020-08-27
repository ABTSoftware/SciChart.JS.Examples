export const code = `
import * as React from "react";

import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { SvgAnnotation } from "scichart/Charting/Visuals/Annotations/SvgAnnotation";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 10);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(0, 10);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.annotations.add(
        new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 2.0, x2: 8.0, y1: 3.0, y2: 7.0 }),
        new BoxAnnotation({
            stroke: "#FF3333",
            strokeThickness: 1,
            fill: "rgba(255,50,50,0.3)",
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0,
        }),
        new BoxAnnotation({
            stroke: "#33FF33",
            strokeThickness: 1,
            fill: "rgba(50, 255, 50, 0.3)",
            x1: 3.0,
            x2: 9.0,
            y1: 4.0,
            y2: 8.0,
        }),
        new BoxAnnotation({
            stroke: "#3333FF",
            strokeThickness: 1,
            fill: "rgba(50,50,255,0.3)",
            x1: 4.0,
            x2: 10.0,
            y1: 5.0,
            y2: 9.0,
        }),
        new SvgAnnotation({
            x1: 1,
            y1: 2.5,
            svgString:
                '<svg width="300" height="100"><g><rect x="0" y="0" width="100%" height="100%" stroke="red" stroke-width="10" fill="orange"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Verdana" font-size="26" fill="blue">SVG ANNOTATION</text></g></svg>',
        })
    );
};

export default function AnnotationsAreEasy() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}

`;
