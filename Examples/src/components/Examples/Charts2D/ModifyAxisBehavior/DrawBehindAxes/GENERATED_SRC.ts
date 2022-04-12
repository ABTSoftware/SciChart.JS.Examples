export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { NumberRange } from "scichart/Core/NumberRange";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    // Allows to use all existing space for drawing
    sciChartSurface.drawSeriesBehindAxis = true;

    const yAxis1 = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(-5.0, 90.0),
    });
    const xAxis1 = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(35.0, 42.6)
    });

    sciChartSurface.xAxes.add(xAxis1);
    sciChartSurface.yAxes.add(yAxis1);


    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        isDigitalLine: false
    });

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        isDigitalLine: false
    });

    lineSeries.strokeThickness = 5;
    lineSeries.stroke = "rgba(255, 134, 72, .47)";

    lineSeries1.strokeThickness = 3;
    lineSeries1.stroke = "rgba(50, 134, 72, .47)";

    sciChartSurface.renderableSeries.add(lineSeries);
    sciChartSurface.renderableSeries.add(lineSeries1);

    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: true });
    const dataSeries1 = new XyDataSeries(wasmContext, { containsNaN: true });
    for (let i = 0; i < 100; i += 0.1) {
        let y = Math.tan(i);
        let y1 = Math.cos(i * 100) * 5;
        dataSeries.append(i, y);
        dataSeries1.append(i, y1);
    }
    lineSeries.dataSeries = dataSeries;
    lineSeries1.dataSeries = dataSeries1;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new PinchZoomModifier(), new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

export default function DrawBehindAxes() {
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