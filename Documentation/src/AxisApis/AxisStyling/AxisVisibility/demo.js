import * as SciChart from "scichart";

async function axisVisibility(divElementId) {
    // #region ExampleA
    // Demonstrates how to show/hide axis parts SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJSLightTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        // Choose a light theme to make this obvious
        theme: new SciChartJSLightTheme()
    });

    // Create a X-Axis hiding elements
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis (Hiding elements)",
            // Show or hide individual elements of the axis
            drawMajorBands: true,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridlines: true,
            drawMinorTicks: true,
            drawMajorTicks: false
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            // Hide the entire axis
            isVisible: false
        })
    );
    // #endregion
    // Add instructions
    const textAnnotation = new TextAnnotation({
        x1: 0.5,
        y1: 0.5,
        text: "Y Axis is hidden. X Axis has some parts hidden",
        textColor: "#00000033",
        fontSize: 26,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(textAnnotation);
}

axisVisibility("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to show/hide axis parts SciChart.js
    const { chartBuilder, EThemeProviderType, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis (Hiding elements)",
                // Show or hide individual elements of the axis
                drawMajorBands: true,
                drawLabels: false,
                drawMinorGridLines: false,
                drawMajorGridlines: true,
                drawMinorTicks: true,
                drawMajorTicks: false
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // Hide the entire axis
                isVisible: false
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
