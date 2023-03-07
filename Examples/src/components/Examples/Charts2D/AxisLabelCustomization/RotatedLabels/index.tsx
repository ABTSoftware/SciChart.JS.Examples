import * as React from "react";
import {
    XyDataSeries,
    NumericAxis,
    WaveAnimation,
    SciChartSurface,
    GradientParams,
    Point,
    SplineMountainRenderableSeries,
    ENumericFormat
} from "scichart";
import {appTheme,classes} from "scichart-example-dependencies";

const divElementId = "chart";

const drawExample = async () => {
    const {
        sciChartSurface,
        wasmContext
    } = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});

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
        drawMinorGridLines: false
    });
    sciChartSurface.xAxes.add(xAxis);

    // Add a Y Axis
    const yAxis = new NumericAxis(wasmContext, {axisTitle: "Y Axis", labelStyle: {fontSize: 16}});
    sciChartSurface.yAxes.add(yAxis);

    // Generate some data
    const startTime = new Date(2020, 0, 1).getTime() / 1000;
    let y = 110;
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < 50; i++) {
        const x = startTime + i * 24 * 60 * 60;
        y = y + 10 * (Math.random() - 0.8);
        xValues.push(x);
        yValues.push(y);
    }

    // Add a Spline Mountain series
    const mountainSeries = new SplineMountainRenderableSeries(wasmContext,
        {
            dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            zeroLineY: 0.0,
            fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
            // when a gradient is required, use fillLinearGradient
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                {color: appTheme.VividTeal + "77", offset: 0},
                {color: "Transparent", offset: 1}
            ]),
            animation: new WaveAnimation({duration: 1000, fadeEffect: true, zeroLine: 0})
        });
    sciChartSurface.renderableSeries.add(mountainSeries);

    return {sciChartSurface, wasmContext};
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function RotatedLabels() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
