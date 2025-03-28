import * as SciChart from "scichart";

async function verticalCharts(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure a vertical chart in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        HorizontalLineAnnotation,
        ELabelPlacement,
        FastLineRenderableSeries,
        XyDataSeries
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            axisAlignment: EAxisAlignment.Left
        })
    );

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            axisAlignment: EAxisAlignment.Top
        })
    );

    // Show how a line series responds to vertical chart
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map(x => Math.sin(x * 0.4));
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            stroke: "#0066FF",
            strokeThickness: 3
        })
    );

    // Show how a HorizontalLineAnnotation responds to vertical chart
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            // normally we set y1 but with vertical charts, we set annotation.x1
            x1: 10,
            labelValue: "HorizontalLineAnnotation with x1 = 10",
            showLabel: true,
            stroke: "#F48420",
            strokeThickness: 2,
            labelPlacement: ELabelPlacement.TopLeft
        })
    );

    // #endregion
}

verticalCharts("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure a vertical chart in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EAxisAlignment, ESeriesType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map(x => Math.sin(x * 0.4));

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis",
                axisAlignment: EAxisAlignment.Left
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Y Axis",
                axisAlignment: EAxisAlignment.Top
            }
        },
        series: [
            {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: "#0066FF",
                    strokeThickness: 3
                },
                xyData: {
                    xValues,
                    yValues
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
