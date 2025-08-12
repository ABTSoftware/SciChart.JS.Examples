import * as SciChart from "scichart";

async function simpleSplineMountainChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a spline mountain chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SplineMountainRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        GradientParams,
        Point
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 * Math.sin(i) - Math.cos(i * 0.12));
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues
    });

    // Create a spline mountain series
    const splineMountainSeries = new SplineMountainRenderableSeries(wasmContext, {
        stroke: "#4682b4",
        // when a solid color is required, use fill
        fill: "rgba(176, 196, 222, 0.7)",
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,0.77)", offset: 0 },
            { color: "rgba(70,130,180,0.0)", offset: 1 }
        ]),
        strokeThickness: 5,
        zeroLineY: 0.0,
        dataSeries: xyDataSeries,
        // Set interpolation points to decide the amount of smoothing
        interpolationPoints: 10,
        // Add a pointmarker to show where the datapoints are
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "white",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(splineMountainSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleSplineMountainChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a spline mountain chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 * Math.sin(i) - Math.cos(i * 0.12));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.SplineMountainSeries,
                xyData: { xValues, yValues },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    zeroLineY: 0.0,
                    fillLinearGradient: {
                        gradientStops: [
                            { color: "rgba(70,130,180,0.77)", offset: 0.0 },
                            { color: "rgba(70,130,180,0.0)", offset: 1 }
                        ],
                        startPoint: { x: 0, y: 0 },
                        endPoint: { x: 0, y: 1 }
                    },
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            fill: "white",
                            strokeThickness: 0
                        }
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
