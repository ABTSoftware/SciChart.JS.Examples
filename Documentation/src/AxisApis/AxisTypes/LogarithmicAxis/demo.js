async function chartWithLogarithmicAxis(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure a logarithmic axis in SciChart.js
    const { SciChartSurface, LogarithmicAxis, SciChartJsNavyTheme, ENumericFormat, NumberRange } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // Create an X and Y Axis
    const xAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        // Format with E
        labelFormat: ENumericFormat.Exponential,
        labelPrecision: 2,
        minorsPerMajor: 10,
        // Adjust major/minor gridline style to make it clearer for the demo
        majorGridLineStyle: { color: "#50C7E077" },
        minorGridLineStyle: { color: "#50C7E033" },
        axisTitle: "Log(10) Axis with Exponential Format",
        visibleRange: new NumberRange(1, 10_000_000),
    });
    sciChartSurface.xAxes.add(xAxisLogarithmic);

    // The LogarithmicAxis will apply logarithmic scaling and labelling to your data.
    // Simply replace a NumericAxis for a LogarithmicAxis on X or Y to apply this scaling
    // Note options logBase, labelFormat which lets you specify exponent on labels
    const yAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        // Format with superscript
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
        minorsPerMajor: 10,
        majorGridLineStyle: { color: "#50C7E077" },
        minorGridLineStyle: { color: "#50C7E033" },
        axisTitle: "Log(10) Axis with Scientific Format",
        visibleRange: new NumberRange(0.1, 1_000_000),
    });
    sciChartSurface.yAxes.add(yAxisLogarithmic);
    // #endregion
}

chartWithLogarithmicAxis("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, NumberRange, ENumericFormat, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.LogarithmicAxis,
            options: {
                logBase: 10,
                // Format with E
                labelFormat: ENumericFormat.Exponential,
                labelPrecision: 2,
                minorsPerMajor: 10,
                // Adjust major/minor gridline style to make it clearer for the demo
                majorGridLineStyle: { color: "#EEEEEE77" },
                minorGridLineStyle: { color: "#EEEEEE33" },
                axisTitle: "Log(10) Axis with Exponential Format",
                visibleRange: new NumberRange(1, 10_000_000),
            },
        },
        yAxes: {
            type: EAxisType.LogarithmicAxis,
            options: {
                logBase: 10,
                // Format with superscript
                labelFormat: ENumericFormat.Scientific,
                labelPrecision: 2,
                minorsPerMajor: 10,
                majorGridLineStyle: { color: "#EEEEEE77" },
                minorGridLineStyle: { color: "#EEEEEE33" },
                axisTitle: "Log(10) Axis with Scientific Format",
                visibleRange: new NumberRange(0.1, 1_000_000),
            },
        },
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
