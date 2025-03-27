async function axisAutoTicksFalse(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure axis autoticks in SciChart.js
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // Adjust major/minor gridline style to make it clearer for the demo
    const styleOptions = {
        majorGridLineStyle: { color: "#50C7E077" },
        minorGridLineStyle: { color: "#50C7E033" },
    };

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "majorDelta 2, minorDelta 1",
        // When autoTicks is false, you must specify majorDelta and minorDelta
        autoTicks: false,
        // Have a major gridline every 2 units on the axis
        majorDelta: 2,
        // Have a minor gridline every 1 unit on the axis
        minorDelta: 1,
        ...styleOptions,
    });

    // Properties may also be set after instantiation, e.g.
    xAxis.autoTicks = false;
    xAxis.majorDelta = 2;
    xAxis.minorDelta = 1;

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "majorDelta 2, minorDelta 1",
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
        ...styleOptions,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    // #endregion
}

axisAutoTicksFalse("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure axis autoticks in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "majorDelta 2, minorDelta 1",
                autoTicks: false,
                majorDelta: 2,
                minorDelta: 1,
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "majorDelta 2, minorDelta 1",
                autoTicks: false,
                majorDelta: 1,
                minorDelta: 0.2,
            },
        },
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
