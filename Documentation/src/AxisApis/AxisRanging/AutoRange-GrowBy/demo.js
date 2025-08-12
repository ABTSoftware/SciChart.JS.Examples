import * as SciChart from "scichart";

async function autoRangeOptions(divElementId) {
    // #region ExampleA
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, EAutoRange, NumberRange } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a chart with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Set GrowBy on the yAxis to add 20% padding above/below
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.2, 0.2)
        })
    );
    // #endregion

    // Outside the public documentation - lets add some data to show autorange
    const { FastLineRenderableSeries, XyDataSeries } = SciChart;
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map(x => Math.sin(x * 0.2));

    const dataSeries = new XyDataSeries(sciChartSurface.webAssemblyContext2D, { xValues, yValues });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(sciChartSurface.webAssemblyContext2D, {
            dataSeries,
            stroke: "#50C7E0",
            strokeThickness: 3
        })
    );
}

autoRangeOptions("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    const { chartBuilder, ESeriesType, EThemeProviderType, EAutoRange, EAxisType, NumberRange } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map(x => Math.sin(x * 0.2));

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "X Axis" }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Y Axis",
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.2, 0.2)
            }
        },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "#50C7E0",
                    strokeThickness: 3
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
