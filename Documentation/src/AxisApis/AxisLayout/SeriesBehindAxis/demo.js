async function seriesBehindAxis(divElementId) {
    // Demonstrates how to configure an inner axis in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        BoxAnnotation,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        FastLineRenderableSeries,
        XyDataSeries,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // #region ExampleA
    sciChartSurface.drawSeriesBehindAxis = true;
    // #endregion
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
        // To allow easier visualisation of axis position
        backgroundColor: "#50C7E022",
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            // To allow easier visualisation of axis position
            backgroundColor: "#F4842022",
        })
    );

    // Add annotations to the viewport to show the bounds of the viewport
    sciChartSurface.annotations.add(
        new BoxAnnotation({
            x1: 0.002,
            x2: 0.998,
            y1: 0,
            y2: 0.998,
            fill: "#FF333311",
            stroke: "#FF333399",
            strokeThickness: 5,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.5,
            y1: 0.5,
            yCoordShift: -50,
            text: "Bounds of the Viewport",
            textColor: "#FF3333",
            fontSize: 26,
            opacity: 0.4,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        })
    );

    // Show how a line series responds to drawSeriesBegindAxis
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map((x) => Math.sin(x * 0.4));
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
            }),
            stroke: "#0066FF",
            strokeThickness: 3,
        })
    );
}

seriesBehindAxis("scichart-root");
