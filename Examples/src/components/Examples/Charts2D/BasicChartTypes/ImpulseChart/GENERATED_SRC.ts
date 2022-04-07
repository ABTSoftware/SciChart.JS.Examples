export const code = `import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { NumberRange } from "scichart/Core/NumberRange";

import classes from "../../../../Examples/Examples.module.scss";
import { EAutoRange } from "scichart/types/AutoRange";
import { FastImpulseRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastImpulseRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 100) })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(-3, 2) })
    );

    const dataSeries = new XyDataSeries(wasmContext);
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.2) * Math.log(i / 100));
    }
    dataSeries.appendRange(xValues, yValues);
    const impulseSeries = new FastImpulseRenderableSeries(wasmContext, {
        fill: "#26c6da",
        dataSeries
    });
    sciChartSurface.renderableSeries.add(impulseSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    return {
        sciChartSurface
    }
};

// React component needed as our examples app is react.
export default function ImpulseChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div id={divElementId} className={classes.ChartWrapper} />
    );
}
`;