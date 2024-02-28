import {
    XyDataSeries,
    NumericAxis,
    WaveAnimation,
    SciChartSurface,
    GradientParams,
    Point,
    SplineMountainRenderableSeries,
    ENumericFormat,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add an X Axis
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis with Rotated Labels",
        labelFormat: ENumericFormat.Date_DDMMYYYY,
        labelStyle: {
            fontSize: 16,
        },
        // Rotation is in degrees clockwise
        rotation: 90,
        // Turn up the number of major ticks (default is 10)
        maxAutoTicks: 30,
        // Turn off minor gridlines, since majors are now closer together
        drawMinorGridLines: false,
    });
    sciChartSurface.xAxes.add(xAxis);
    // Add a Y Axis
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "Y Axis", labelStyle: { fontSize: 16 } });
    sciChartSurface.yAxes.add(yAxis);
    // Generate some data
    const startTime = new Date(2020, 0, 1).getTime() / 1000;
    let y = 110;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 50; i++) {
        const x = startTime + i * 24 * 60 * 60;
        y = y + 10 * (Math.random() - 0.8);
        xValues.push(x);
        yValues.push(y);
    }
    // Add a Spline Mountain series
    const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        zeroLineY: 0.0,
        fill: "rgba(176, 196, 222, 0.7)",
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividTeal + "77", offset: 0 },
            { color: "Transparent", offset: 1 },
        ]),
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 }),
    });
    sciChartSurface.renderableSeries.add(mountainSeries);
    return { sciChartSurface, wasmContext };
};
