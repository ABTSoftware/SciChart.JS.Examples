async function centralAxisConfigure(divElementId) {
    // Demonstrates how to configure a central axis in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        CentralAxesLayoutManager,
        EInnerAxisPlacementCoordinateMode,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // #region ExampleA
    // Apply the CentralAxesLayoutManager to the SciChartSurface
    sciChartSurface.layoutManager = new CentralAxesLayoutManager({
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Pixel,
        horizontalAxisPosition: 3,
        verticalAxisPosition: 100,
    });

    // Continue to add your X,Y axis as before
    // #endregion

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            // To allow easier visualisation of axis position
            backgroundColor: "#50C7E022",
            axisBorder: {
                borderTop: 1,
                color: "#50C7E0",
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            // To allow easier visualisation of axis position
            backgroundColor: "#F4842022",
            axisBorder: {
                borderRight: 1,
                color: "#F48420",
            },
        })
    );
}

centralAxisConfigure("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to configure a central axis in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, ELayoutManagerType, EInnerAxisPlacementCoordinateMode } =
        SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: { type: EThemeProviderType.Dark },
            layoutManager: {
                type: ELayoutManagerType.CentralAxes,
                options: {
                    horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
                    verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Pixel,
                    horizontalAxisPosition: 3,
                    verticalAxisPosition: 100,
                },
            },
        },
        // etc...
        // #endregion
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // To allow easier visualisation of axis position
                backgroundColor: "#50C7E022",
                axisBorder: {
                    borderTop: 1,
                    color: "#50C7E0",
                },
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // To allow easier visualisation of axis position
                backgroundColor: "#F4842022",
                axisBorder: {
                    borderRight: 1,
                    color: "#F48420",
                },
            },
        },
    });
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
