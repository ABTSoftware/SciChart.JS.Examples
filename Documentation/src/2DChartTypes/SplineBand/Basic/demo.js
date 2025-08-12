import * as SciChart from "scichart";

async function simpleSplineBandChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a Spline Band chart using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SplineBandRenderableSeries,
        XyyDataSeries,
        SciChartJsNavyTheme,
        EllipsePointMarker
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    const y1Values = [];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 * Math.sin(i) - Math.cos(i * 0.12));
        y1Values.push(1.8 + 0.19 * Math.sin(i * 2) - Math.cos(i * 0.24));
    }

    const dataSeries = new XyyDataSeries(wasmContext, { xValues, yValues, y1Values });

    const bandSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#F48420",
        strokeY1: "#50C7E0",
        fill: "#F4842033",
        fillY1: "#50C7E033",
        strokeThickness: 2,
        // Add a pointmarker to show where the datapoints are
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "white",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(bandSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleSplineBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    const y1Values = [];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 * Math.sin(i) - Math.cos(i * 0.12));
        y1Values.push(1.8 + 0.19 * Math.sin(i * 2) - Math.cos(i * 0.24));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.SplineBandSeries,
                xyyData: {
                    xValues,
                    yValues,
                    y1Values
                },
                options: {
                    stroke: "#FF1919FF",
                    strokeY1: "#279B27FF",
                    fill: "#279B2733",
                    fillY1: "#FF191933",
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            strokeThickness: 1,
                            fill: "steelblue",
                            stroke: "LightSteelBlue"
                        }
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
