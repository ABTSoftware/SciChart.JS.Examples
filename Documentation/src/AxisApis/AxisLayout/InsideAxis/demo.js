import * as SciChart from "scichart";

async function innerAxis(divElementId) {
    // Demonstrates how to configure an inner axis in SciChart.js
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // #region ExampleA
    // Configure an axis to display inside the chart
    const xAxis = new NumericAxis(wasmContext, {
        isInnerAxis: true,
        axisTitle: "Inner axis",
        // To allow easier visualisation of axis position
        backgroundColor: "#50C7E022"
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);
    // #endregion

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Outer axis",
            // To allow easier visualisation of axis position
            backgroundColor: "#F4842022"
        })
    );

    // Add annotations to the viewport to show the bounds of the viewport
    const { BoxAnnotation, TextAnnotation, ECoordinateMode, EHorizontalAnchorPoint } = SciChart;
    sciChartSurface.annotations.add(
        new BoxAnnotation({
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 1,
            fill: "#FF333311",
            stroke: "#FF333355",
            strokeThickness: 5,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
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
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center
        })
    );
}

innerAxis("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure an inner axis in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                isInnerAxis: true,
                axisTitle: "Inner axis",
                // To allow easier visualisation of axis position
                backgroundColor: "#50C7E022"
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Outer axis",
                // To allow easier visualisation of axis position
                backgroundColor: "#F4842022"
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
