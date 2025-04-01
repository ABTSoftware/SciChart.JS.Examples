import * as SciChart from "scichart";

async function dataLabelsMetadata(divElementId) {
    // #region ExampleA
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        SciChartJsNavyTheme
    } = SciChart;

    // or for npm: import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a chart with line series with a point-marker
    // optional metadata is also passed with javascript objecst into the dataSeries
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
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
                metadata: [
                    { text: "Bananas", isSelected: false },
                    { text: "Apples", isSelected: false },
                    { text: "Pears", isSelected: false },
                    { text: "Pineapples", isSelected: false },
                    { text: "Plums", isSelected: false },
                    { text: "Cherries", isSelected: false },
                    { text: "Strawberries", isSelected: false },
                    { text: "Blueberries", isSelected: false },
                    { text: "Lemons", isSelected: false },
                    { text: "Limes", isSelected: false },
                    { text: "Papaya", isSelected: false },
                    { text: "Guava", isSelected: false }
                ]
            }),
            // Next, add the dataLabels. Simply setting dataLabel style makes labels visible
            // We also pass a metaDataSelector which is a function that can be used to format labels from metadata objects
            dataLabels: {
                metaDataSelector: metaData => metaData.text,
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

dataLabelsMetadata("scichart-root");

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
                    yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
                    metadata: [
                        { text: "Bananas", isSelected: false },
                        { text: "Apples", isSelected: false },
                        { text: "Pears", isSelected: false },
                        { text: "Pineapples", isSelected: false },
                        { text: "Plums", isSelected: false },
                        { text: "Cherries", isSelected: false },
                        { text: "Strawberries", isSelected: false },
                        { text: "Blueberries", isSelected: false },
                        { text: "Lemons", isSelected: false },
                        { text: "Limes", isSelected: false },
                        { text: "Papaya", isSelected: false },
                        { text: "Guava", isSelected: false }
                    ]
                },
                options: {
                    stroke: "SteelBlue",
                    strokeThickness: 3,
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
                    // Next, add the dataLabels. Simply setting dataLabel style makes labels visible
                    // We also pass a metaDataSelector which is a function that can be used to format labels from metadata objects
                    dataLabels: {
                        metaDataSelector: metaData => metaData.text,
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
