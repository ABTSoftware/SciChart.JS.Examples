import * as SciChart from "scichart";

async function simpleColumnChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        GradientParams,
        Point
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create some data
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = [
        0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16.0, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1
    ];

    // Create and add a column series
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        // When solid fill required, use fill
        fill: "rgba(176, 196, 222, 0.5)",
        // When gradient fill required, use fillGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,0.77)", offset: 0 },
            { color: "rgba(70,130,180,0.0)", offset: 1 }
        ]),
        stroke: "#FFFFFF77",
        strokeThickness: 2,
        // optional cornerradius. Experimental!
        cornerRadius: 4,
        // Defines the relative width between columns
        dataPointWidth: 0.7,
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    });

    sciChartSurface.renderableSeries.add(columnSeries);
    // #endregion
}

simpleColumnChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a Column chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Create some data
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = [
        0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16.0, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1
    ];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ColumnSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    dataPointWidth: 0.7
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
