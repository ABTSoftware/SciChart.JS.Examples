import * as SciChart from "scichart";

async function labelAlignment(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure label alignment in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        ELabelAlignment,
        NumberRange,
        ENumericFormat
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Create an XAxis on the bottom
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis, center aligned labels",
        keepLabelsWithinAxis: false,
        axisBorder: { color: "#50C7E077", borderTop: 1 },
        backgroundColor: "#50C7E022"
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new LogarithmicAxis(wasmContext, {
            axisTitle: "Y Axis, left-aligned labels",
            axisAlignment: EAxisAlignment.Left,
            labelFormat: ENumericFormat.Decimal,
            labelStyle: { alignment: ELabelAlignment.Left },
            visibleRange: new NumberRange(0.1, 1e6),
            logBase: 10,
            axisBorder: { color: "#50C7E077", borderRight: 1 },
            backgroundColor: "#50C7E022"
        })
    );

    // Creating a NumericAxis as a YAxis on the right
    sciChartSurface.yAxes.add(
        new LogarithmicAxis(wasmContext, {
            axisTitle: "Y Axis, right-aligned labels",
            axisAlignment: EAxisAlignment.Right,
            labelFormat: ENumericFormat.Decimal,
            labelStyle: { alignment: ELabelAlignment.Right },
            visibleRange: new NumberRange(0.1, 1e6),
            logBase: 10,
            axisBorder: { color: "#50C7E077", borderLeft: 1 },
            backgroundColor: "#50C7E022"
        })
    );
    // #endregion
}

labelAlignment("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure a numeric axis in SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        EAxisAlignment,
        ELabelAlignment,
        EAxisType,
        ENumericFormat,
        NumberRange
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis, center aligned labels",
                keepLabelsWithinAxis: false,
                axisBorder: { color: "#50C7E077", borderTop: 1 },
                backgroundColor: "#50C7E022"
            }
        },
        yAxes: [
            {
                type: EAxisType.LogarithmicAxis,
                options: {
                    axisTitle: "Y Axis, left-aligned labels",
                    axisAlignment: EAxisAlignment.Left,
                    labelFormat: ENumericFormat.Decimal,
                    labelStyle: { alignment: ELabelAlignment.Left },
                    visibleRange: new NumberRange(0.1, 1e6),
                    logBase: 10,
                    axisBorder: { color: "#50C7E077", borderRight: 1 },
                    backgroundColor: "#50C7E022"
                }
            },
            {
                type: EAxisType.LogarithmicAxis,
                options: {
                    axisTitle: "Y Axis, right-aligned labels",
                    axisAlignment: EAxisAlignment.Right,
                    labelFormat: ENumericFormat.Decimal,
                    labelStyle: { alignment: ELabelAlignment.Right },
                    visibleRange: new NumberRange(0.1, 1e6),
                    logBase: 10,
                    axisBorder: { color: "#50C7E077", borderLeft: 1 },
                    backgroundColor: "#50C7E022"
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
