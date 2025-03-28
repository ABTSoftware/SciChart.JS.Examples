import * as SciChart from "scichart";

async function chartTitles(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure chart titles SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJSLightTheme,
        Thickness,
        EMultiLineAlignment,
        ETextAlignment,
        ETitlePosition
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme(),
        title: "SciChart.js Chart Title",
        titleStyle: {
            color: "#333333",
            fontSize: 32,
            padding: Thickness.fromString("14 8 4 8"), // Top, Right, Bottom, Left padding
            useNativeText: false, // Use WebGL accelerated text
            placeWithinChart: false, // When true, place inside chart, else outside
            multiLineAlignment: EMultiLineAlignment.Left, // When \n present how does multiline text align (Left, Center, Right)
            alignment: ETextAlignment.Center, // Alignment of title (Left, Center, Right)
            position: ETitlePosition.Top // Vertical position of title (Top, Bottom, Left, Right)
        }
    });

    // Create an X and Y Axis with title
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #endregion
}

chartTitles("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure chart titles in SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        EAxisType,
        Thickness,
        EMultiLineAlignment,
        ETextAlignment,
        ETitlePosition
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: { type: EThemeProviderType.Dark },
            title: "SciChart.js Chart Title",
            titleStyle: {
                color: "#50C7E0",
                fontSize: 24,
                padding: Thickness.fromString("14 0 4 0"),
                useNativeText: true,
                placeWithinChart: false,
                multiLineAlignment: EMultiLineAlignment.Center,
                alignment: ETextAlignment.Center,
                position: ETitlePosition.Top
            }
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "X Axis" }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "Y Axis" }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
