import * as SciChart from "scichart";

async function dataLabelsBasicExample(divElementId) {
    // #region ExampleA
    // Demonstrates how to add DataLabels to a chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a chart with X, Y axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Line series with a pointmarker & some data
    // We add dataLabels by setting the dataLabels constructor option
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: "SteelBlue",
                fill: "LightSteelBlue"
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
            }),
            // Data labels are enabled here. Simply set style, color
            dataLabels: {
                style: {
                    fontFamily: "Default",
                    fontSize: 16
                },
                color: "#EEE"
            }
        })
    );
    // #endregion
}

dataLabelsBasicExample("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to add DataLabels to a chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
                },
                options: {
                    stroke: "#0066FF",
                    strokeThickness: 5,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 10,
                            height: 10,
                            strokeThickness: 2,
                            stroke: "SteelBlue",
                            fill: "LightSteelBlue"
                        }
                    },
                    // Data labels are enabled here. Simply set style, color
                    dataLabels: {
                        style: {
                            fontFamily: "Default",
                            fontSize: 16
                        },
                        color: "#EEE"
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
