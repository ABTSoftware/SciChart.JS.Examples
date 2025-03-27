async function rotatingLabels(divElementId) {
    // Demonstrates how to configure a text axis in SciChart.js
    // using TextLabelProvider & NumericAxis
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TextLabelProvider,
        FastColumnRenderableSeries,
        XyDataSeries,
        GradientParams,
        Point,
        ELabelAlignment,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // #region ExampleA
    // Create an XAxis with 90-degree rotated labels
    const xAxis = new NumericAxis(wasmContext, {
        labelProvider: new TextLabelProvider({
            // When passed as an object, x values will be mapped to fields
            labels: [
                // Provide multiple lines directly
                ["Apples", "and Bananas"],
                ["Strawberries", "and Raspberries"],
                ["Lemons, Limes", "and Oranges"],
                // These will be auto-wrapped
                "Apples and Bananas",
                "Strawberries and Raspberries",
                "Lemons Limes and Oranges",
            ],
            maxLength: 7,
        }),
        labelStyle: {
            alignment: ELabelAlignment.Center,
        },
    });
    sciChartSurface.xAxes.add(xAxis);
    // #endregion

    // Create a YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a column chart with the data. Labels are mapped to sequential X-values
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [0, 1, 2, 3, 4, 5],
                yValues: [0.1, 0.2, 0.4, 0.8, 1.1, 1.2],
            }),
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(70,130,180,0.77)", offset: 0 },
                { color: "rgba(70,130,180,0.0)", offset: 1 },
            ]),
            stroke: "#FFFFFF77",
            strokeThickness: 2,
        })
    );
}

rotatingLabels("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to configure a text axis in SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, ELabelProviderType, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                labelProvider: {
                    type: ELabelProviderType.Text,
                    options: {
                        labels: [
                            // Provide multiple lines directly
                            ["Apples", "and Bananas"],
                            ["Strawberries", "and Raspberries"],
                            ["Lemons, Limes", "and Oranges"],
                            // These will be auto-wrapped
                            "Apples and Bananas",
                            "Strawberries and Raspberries",
                            "Lemons Limes and Oranges",
                        ],
                        maxLength: 7,
                    },
                },
            },
        },
        // ... );
        // #endregion
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {},
        },
        series: [
            {
                type: ESeriesType.ColumnSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [0.1, 0.2, 0.4, 0.8, 1.1, 1.2],
                },
                options: {
                    fillLinearGradient: {
                        gradientStops: [
                            { color: "rgba(70,130,180,0.77)", offset: 0.0 },
                            { color: "rgba(70,130,180,0.0)", offset: 1 },
                        ],
                        startPoint: { x: 0, y: 0 },
                        endPoint: { x: 0, y: 1 },
                    },
                    stroke: "#FFFFFF77",
                    strokeThickness: 2,
                },
            },
        ],
    });
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
