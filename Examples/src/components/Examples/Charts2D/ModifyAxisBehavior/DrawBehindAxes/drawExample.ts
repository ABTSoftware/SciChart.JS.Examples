import {
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ELineDrawMode,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    ZoomPanModifier,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "SciChartSurface with Series Drawn Behind Axis",
        titleStyle: {
            fontSize: 20,
            fontWeight: "Bold",
            placeWithinChart: true,
            padding: Thickness.fromString("14 2 10 0"),
            color: appTheme.ForegroundColor + "C4",
        },
    });

    // When true, Series are drawn behind axis (Axis inside chart)
    sciChartSurface.drawSeriesBehindAxis = true;

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            visibleRange: new NumberRange(28.0, 42.6),
            axisTitle: "X Axis",
            labelStyle: {
                fontSize: 20,
            },
            axisBorder: {
                borderTop: 0,
                color: appTheme.PaleSkyBlue + "33",
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            visibleRange: new NumberRange(-40.0, 140.0),
            axisTitle: "Y Axis",
            labelStyle: {
                fontSize: 20,
            },
            axisBorder: {
                borderLeft: 0,
                color: appTheme.PaleSkyBlue + "33",
            },
        })
    );

    const xValues = [];
    const yValues = [];
    const y1Values = [];

    for (let i = 0; i < 100; i += 0.1) {
        xValues.push(i);
        yValues.push(Math.tan(i));
        y1Values.push(Math.cos(i * 100) * 5);
    }

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            drawNaNAs: ELineDrawMode.PolyLine,
            strokeThickness: 5,
            stroke: "rgba(255, 134, 72, .47)",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            drawNaNAs: ELineDrawMode.PolyLine,
            strokeThickness: 3,
            stroke: "rgba(50, 134, 72, .47)",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values }),
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier()
    );

    return { sciChartSurface, wasmContext };
};
