import * as SciChart from "scichart";

async function basicRectangleSeriesChart(divElementId) {
    const {
        EColumnMode,
        EColumnYMode,
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        FastRectangleRenderableSeries,
        XyxyDataSeries
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        fill: "steelblue",
        stroke: "white",
        strokeThickness: 1,
        opacity: 1
    });

    sciChartSurface.renderableSeries.add(rectangleSeries);
}

basicRectangleSeriesChart("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        series: [
            {
                type: ESeriesType.RectangleSeries,
                xyxyData: {
                    xValues,
                    yValues,
                    x1Values,
                    y1Values
                },
                options: {
                    fill: "steelblue",
                    stroke: "darkred",
                    strokeThickness: 2,
                    opacity: 1,
                    columnXMode: SciChart.EColumnMode.StartEnd,
                    columnYMode: SciChart.EColumnYMode.TopBottom
                }
            }
        ]
    });
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
