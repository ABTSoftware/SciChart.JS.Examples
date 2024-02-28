import { appTheme } from "scichart-example-dependencies";
import {
    EAxisAlignment,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EXyDirection,
    FastLineRenderableSeries,
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
        new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
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
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );
    const seriesCount = 10;
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
            axisTitle: `Y ${i}`,
        });
        sciChartSurface.yAxes.add(yAxis);
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxis.id,
            stroke: "auto",
            strokeThickness: 2,
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
function getRandomSinewave(wasmContext, pad, amplitude, phase, pointCount, freq) {
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
