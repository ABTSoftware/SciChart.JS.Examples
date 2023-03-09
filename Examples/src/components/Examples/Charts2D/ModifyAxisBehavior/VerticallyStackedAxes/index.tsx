import * as React from "react";
import { appTheme } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import { TSciChart } from "scichart/types/TSciChart";

import {
    EAxisAlignment,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EXyDirection,
    FastLineRenderableSeries,
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
    MouseWheelZoomModifier, NumberRange, NumericAxis, RubberBandXyZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier
} from "scichart";

const divElementId = "chart1";

const drawExample = async (seriesCount: number) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Vertically Stacked Axis: Custom layout of axis to allow traces to overlap. Useful for ECG charts",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    for (let i = 0; i < seriesCount; i++) {
        const range = 10 / seriesCount;
        const yAxis = new NumericAxis(wasmContext, {
            id: "Y" + i,
            visibleRange: new NumberRange(-range, range),
            axisAlignment: EAxisAlignment.Left,
            zoomExtentsToInitialRange: true,
            maxAutoTicks: 5,
            drawMinorGridLines: false,
            axisBorder: { borderTop: 5, borderBottom: 5 },
            axisTitle: `Y ${i}`
        });
        sciChartSurface.yAxes.add(yAxis);

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxis.id,
            stroke: "auto",
            strokeThickness: 2
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
        const time = (10 * i) / pointCount;
        dataSeries.append(time, 0);
    }

    for (let i = pad, j = 0; i < pointCount; i++, j++) {
        amplitude = Math.min(3, Math.max(0.1, amplitude * (1 + (Math.random() - 0.5) / 10)));
        freq = Math.min(50, Math.max(0.1, freq * (1 + (Math.random() - 0.5) / 50)));

        const time = (10 * i) / pointCount;
        const wn = (2 * Math.PI) / (pointCount / freq);

        const d = amplitude * Math.sin(j * wn + phase);
        dataSeries.append(time, d);
    }

    return dataSeries;
}
