import * as SciChart from "scichart";

async function axisAutoTicks(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure axis autoticks in SciChart.js
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Adjust major/minor gridline style to make it clearer for the demo
    const styleOptions = {
        majorGridLineStyle: { color: "#50C7E077" },
        minorGridLineStyle: { color: "#50C7E033" }
    };

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "maxAutoTicks 10, minorsPerMajor 2",
        // Default true, automatically calculate axis.MajorDelta, axis.MinorDelta
        autoTicks: true,
        // This is a hint which defines the max number of major gridlines/labels visible at any one time.
        // The actual number of gridlines may be lower than this depending on zoom level
        maxAutoTicks: 10,
        // For every major gridline, this defines how many minor gridlines there are. Default is 5.
        minorsPerMajor: 2,
        ...styleOptions
    });

    // Properties may also be set after instantiation, e.g.
    xAxis.autoTicks = true;
    xAxis.maxAutoTicks = 10;
    xAxis.minorsPerMajor = 2;

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "maxAutoTicks 5, minorsPerMajor 4",
        autoTicks: true,
        maxAutoTicks: 5,
        minorsPerMajor: 4,
        ...styleOptions
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    // #endregion
}

axisAutoTicks("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure a axis autoticks in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "maxAutoTicks 10, minorsPerMajor 2",
                autoTicks: true,
                maxAutoTicks: 10,
                minorsPerMajor: 2
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "maxAutoTicks 5, minorsPerMajor 4",
                autoTicks: true,
                maxAutoTicks: 5,
                minorsPerMajor: 4
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
