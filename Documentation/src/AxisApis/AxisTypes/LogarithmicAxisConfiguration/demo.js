async function loggarithmicAxisConfig(divElementId) {
    // Demonstrates how to configure a logarithmic axis in SciChart.js
    const {
        SciChartSurface,
        LogarithmicAxis,
        SciChartJsNavyTheme,
        ENumericFormat,
        NumberRange,
        ELogarithmicMajorTickMode,
        ELogarithmicMinorTickMode,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // #region ExampleA
    // Create Log(10) axis with options
    sciChartSurface.xAxes.add(
        new LogarithmicAxis(wasmContext, {
            logBase: 10,
            // Format with E
            labelFormat: ENumericFormat.SignificantFigures,
            majorTickMode: ELogarithmicMajorTickMode.EqualSpacing,
            minorTickMode: ELogarithmicMinorTickMode.Logarithmic,
            // Adjust major/minor gridline style to make it clearer for the demo
            majorGridLineStyle: { color: "#50C7E077" },
            minorGridLineStyle: { color: "#50C7E033" },
            axisTitle: "Log(10) Axis with equally spaced gridlines",
            visibleRange: new NumberRange(1, 10_000_000),
        })
    );

    // Creating a Log(2) Axis with options
    sciChartSurface.yAxes.add(
        new LogarithmicAxis(wasmContext, {
            logBase: 2,
            // Format with 2 decimal places
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            labelPrefix: "$",
            majorTickMode: ELogarithmicMajorTickMode.RoundNumbers,
            minorTickMode: ELogarithmicMinorTickMode.Linear,
            // Adjust major/minor gridline style to make it clearer for the demo
            majorGridLineStyle: { color: "#50C7E077" },
            minorGridLineStyle: { color: "#50C7E033" },
            axisTitle: "Log(2) Axis configured for financial",
            visibleRange: new NumberRange(100, 1000),
        })
    );
    // #endregion
}

loggarithmicAxisConfig("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        NumberRange,
        ENumericFormat,
        EAxisType,
        ELogarithmicMinorTickMode,
        ELogarithmicMajorTickMode,
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.LogarithmicAxis,
            options: {
                logBase: 10,
                // Format with E
                labelFormat: ENumericFormat.SignificantFigures,
                majorTickMode: ELogarithmicMajorTickMode.EqualSpacing,
                minorTickMode: ELogarithmicMinorTickMode.Logarithmic,
                // Adjust major/minor gridline style to make it clearer for the demo
                majorGridLineStyle: { color: "#50C7E077" },
                minorGridLineStyle: { color: "#50C7E033" },
                axisTitle: "Log(10) Axis with equally spaced gridlines",
                visibleRange: new NumberRange(1, 10_000_000),
            },
        },
        yAxes: {
            type: EAxisType.LogarithmicAxis,
            options: {
                logBase: 2,
                // Format with 2 decimal places
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 2,
                labelPrefix: "$",
                majorTickMode: ELogarithmicMajorTickMode.RoundNumbers,
                minorTickMode: ELogarithmicMinorTickMode.Linear,
                // Adjust major/minor gridline style to make it clearer for the demo
                majorGridLineStyle: { color: "#50C7E077" },
                minorGridLineStyle: { color: "#50C7E033" },
                axisTitle: "Log(2) Axis configured for financial",
                visibleRange: new NumberRange(100, 1000),
            },
        },
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
