import * as SciChart from "scichart";

async function chartWithDateTimeNumericAxis(divElementId) {
    // Demonstrates how to configure an axis with rotated labels in scichart.js
    const { SciChartSurface, SciChartJsNavyTheme, NumericAxis, ENumericFormat, NumberRange } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis / 90 Degree Rotation",
        visibleRange: new NumberRange(1e6, 2e6),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 4,
        // Allow more labels for the demo
        maxAutoTicks: 30,
        // Rotation is in degrees clockwise. Negative numbers are OK
        rotation: 90,
        // Turn off minor gridlines, since majors are now closer together
        drawMinorGridLines: false
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis, -25 Degree Rotation",
            rotation: -25,
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4
        })
    );
    // #endregion
}

chartWithDateTimeNumericAxis("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a chart with rotated labels with the builder API
    const { chartBuilder, EThemeProviderType, ENumericFormat, EAxisType, NumberRange } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    // If you want to show an Axis with rotated labels. Using a numeric axis for example
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis / 90 Degree Rotation",
                visibleRange: new NumberRange(1e6, 2e6),
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 4,
                // Allow more labels for the demo
                maxAutoTicks: 30,
                // Rotation is in degrees clockwise. Negative numbers are OK
                rotation: 90,
                // Turn off minor gridlines, since majors are now closer together
                drawMinorGridLines: false
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Y Axis, Numeric",
                rotation: 25,
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 4
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
