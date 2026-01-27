import {
    ENumericFormat,
    FastLineRenderableSeries,
    LegendModifier,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XyDataSeries,
    Thickness,
    ZoomExtentsModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "./ExampleDataProvider";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    // Create an X and Y Axis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);

    // Create some data
    const data0 = ExampleDataProvider.getExponentialCurve(2, 100);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data0.xValues,
                yValues: data0.yValues,
                dataSeriesName: "y = x",
            }),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,            
        })
    );

    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};