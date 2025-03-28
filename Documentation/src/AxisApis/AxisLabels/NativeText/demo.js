import * as SciChart from "scichart";

async function nativeText(divElementId) {
    // #region ExampleA
    // Demonstrates native text vs. standard text in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        ELabelAlignment,
        SciChartDefaults,
        Thickness
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Use Native text for all axes by default
    SciChartDefaults.useNativeText = true;

    const labelStyle = {
        fontFamily: "arial",
        fontSize: "14",
        color: "white",
        padding: new Thickness(0, 0, 0, 0),
        alignment: ELabelAlignment.Auto
    };

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Enable native text for a specific axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            useNativeText: true,
            // Most style options are supported
            // fontStyle and FontWeight are not supported for native text
            labelStyle,
            axisTitle: "Native X",
            backgroundColor: "#50C7E011"
        }),
        new NumericAxis(wasmContext, {
            // Disable native text for a specfic axis
            useNativeText: false,
            axisAlignment: EAxisAlignment.Top,
            // Same style for comparison
            labelStyle,
            axisTitle: "Normal X",
            backgroundColor: "#50C7E011"
        })
    );
    sciChartSurface.yAxes.add(
        // Native text with default values
        new NumericAxis(wasmContext, { axisTitle: "Native Y", labelStyle, backgroundColor: "#50C7E011" }),
        // Normal text with default values
        new NumericAxis(wasmContext, {
            labelStyle,
            useNativeText: false,
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Normal Y",
            backgroundColor: "#50C7E011"
        })
    );
}

nativeText("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates native text vs. standard text in SciChart.js using the Builder API
    const { chartBuilder, SciChartDefaults, EAxisAlignment, ELabelAlignment, EAxisType, Thickness } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Use Native text for all axes by default
    SciChartDefaults.useNativeText = true;

    const labelStyle = {
        fontFamily: "arial",
        fontSize: "14",
        color: "white",
        padding: new Thickness(0, 0, 0, 0),
        alignment: ELabelAlignment.Auto
    };

    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    useNativeText: true,
                    // Most style options are supported
                    // fontStyle and FontWeight are not supported for native text
                    labelStyle,
                    axisTitle: "Native X",
                    backgroundColor: "#50C7E011"
                }
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    // Disable native text for a specfic axis
                    useNativeText: false,
                    axisAlignment: EAxisAlignment.Top,
                    // Same style for comparison
                    labelStyle,
                    axisTitle: "Normal X",
                    backgroundColor: "#50C7E011"
                }
            }
        ],
        yAxes: [
            {
                // Native text with default values
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Native Y", labelStyle, backgroundColor: "#50C7E011" }
            },
            {
                type: EAxisType.NumericAxis,
                // Normal text with default values
                options: {
                    labelStyle,
                    useNativeText: false,
                    axisAlignment: EAxisAlignment.Left,
                    axisTitle: "Normal Y",
                    backgroundColor: "#50C7E011"
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
