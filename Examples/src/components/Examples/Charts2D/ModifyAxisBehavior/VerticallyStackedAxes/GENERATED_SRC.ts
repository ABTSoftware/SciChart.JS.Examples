export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import { TSciChart } from "scichart/types/TSciChart";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { NumberRange } from "scichart/Core/NumberRange";
import { LeftAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/LeftAlignedOuterVerticallyStackedAxisLayoutStrategy";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { EXyDirection } from "scichart/types/XyDirection";
import { EExecuteOn } from "scichart/types/ExecuteOn";

const divElementId = "chart1";

const drawExample = async (seriesCount: number) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top
    }));

    for (let i = 0; i < seriesCount; i++) {
        const range = 10 / seriesCount;
        const yAxis = new NumericAxis(wasmContext, { 
            id: "Y" + i,
            visibleRange: new NumberRange(-range, range),
            axisAlignment: EAxisAlignment.Left,
            zoomExtentsToInitialRange: true,
            maxAutoTicks: 5,
            drawMinorGridLines: false,
            axisBorder: { borderTop: 5, borderBottom: 5 }
        });
        sciChartSurface.yAxes.add(yAxis);

        let color = Math.round(((i + 1) * 250) / seriesCount);
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxis.id,
            stroke: \`rgba(\${255 - color},\${color},\${(color + 125) % 255},0.7)\`
        });
        lineSeries.dataSeries = getRandomSinewave(wasmContext, 0, Math.random() * 3, Math.random() * 50, 10000, 10);
        sciChartSurface.renderableSeries.add(lineSeries);
    }

    // Optional: Add some interactivity modifiers to enable zooming and panning
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier(),
        new XAxisDragModifier(),
        new RubberBandXyZoomModifier({ xyDirection: EXyDirection.XDirection, executeOn: EExecuteOn.MouseRightButton }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.YDirection }),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface, wasmContext };
};

export default function VerticallyStackedAxes() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(10);
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}

function getRandomSinewave(
    wasmContext: TSciChart,
    pad: number,
    amplitude: number,
    phase: number,
    pointCount: number,
    freq: number
) {
    const dataSeries = new XyDataSeries(wasmContext);

    for (let i = 0; i < pad; i++) {
        const time = 10 * i / pointCount;
        dataSeries.append(time, 0);
    }

    for (let i = pad, j = 0; i < pointCount; i++, j++) {
        amplitude = Math.min(3, Math.max(0.1, amplitude * (1 + (Math.random()-0.5) / 10)));
        freq = Math.min(50, Math.max(0.1, freq * (1 + (Math.random()-0.5) / 50)));

        const time = 10 * i / pointCount;
        const wn = 2 * Math.PI / (pointCount / freq);

        const d = amplitude * Math.sin(j * wn + phase);
        dataSeries.append(time, d);
    }

    return dataSeries;
}
`;