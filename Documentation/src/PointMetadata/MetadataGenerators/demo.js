import * as SciChart from "scichart";

// #region ExampleA
// Create a metadata class. Confirms to interface I1DMetadataGenerator
class ExampleMetadataGenerator {
    // Accept and store the raw data in the constructor
    constructor(stringArray) {
        console.log(`${stringArray}`);
        this.stringValues = stringArray;
        this.type = "ExampleMetadataGenerator";
    }
    // This is called by SciChart to get the metadata to set when the dataSeries is created
    getMetadata = () => this.stringValues.map(s => ({ stringValue: s }));
    // Unused for this example. Used to create a clone of metadata template for each datapoint
    getSingleMetadata = () => ({ stringValue: "" });
    // Required for serialization and builder API
    toJSON = () => ({ type: this.type, data: this.stringValues });
}
// #endregion

async function metadataGenerators(divElementId) {
    // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EllipsePointMarker,
        NumberRange,
        RolloverModifier,
        EBaseType,
        chartBuilder
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // #region ExampleB
    // call chartBuilder.registerType to register a new custom type
    chartBuilder.registerType(
        EBaseType.MetadataGenerator,
        "ExampleMetadataGenerator",
        data => new ExampleMetadataGenerator(data)
    );

    // Assign a Metadata generator instance to create metadata dynamically
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4.3, 5.3, 6, 6.3, 6.4],
        metadata: { type: "ExampleMetadataGenerator", data: ["Here's", "Some", "Metadata", "From", "Generator"] }
    });
    // #endregion

    // Add a line series with the metadata
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "White" })
        })
    );
    // Add a RolloverModifier configured to output X,Y,Metadata.stringValue and customValue
    sciChartSurface.chartModifiers.add(
        new RolloverModifier({
            snapToDataPoint: true,
            tooltipDataTemplate: seriesInfo => [
                `X: ${seriesInfo.formattedXValue}`,
                `Y: ${seriesInfo.formattedYValue}`,
                `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`
            ]
        })
    );
    // #endregion

    const { TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.5,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Metadata Generators Example",
            fontSize: 36,
            yCoordShift: -125,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover over the chart to see metadata",
            fontSize: 20,
            yCoordShift: -75,
            ...options
        })
    );
}

metadataGenerators("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js with the BuilderAPI
    const { chartBuilder, ESeriesType, EThemeProviderType, EChart2DModifierType, EPointMarkerType, EBaseType } =
        SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleC
    // call chartBuilder.registerType to register a new custom type
    chartBuilder.registerType(
        EBaseType.MetadataGenerator,
        "ExampleMetadataGenerator",
        data => new ExampleMetadataGenerator(data)
    );

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                // Metadata is set in xyData property
                xyData: {
                    xValues: [1, 2, 3, 4, 5],
                    yValues: [4.3, 5.3, 6, 6.3, 6.4],
                    metadata: {
                        type: "ExampleMetadataGenerator",
                        data: ["Here's", "Some", "Metadata", "From", "Generator"]
                    }
                },
                // ...
                // #endregion
                options: {
                    stroke: "#C52E60",
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 11,
                            height: 11,
                            fill: "White"
                        }
                    }
                }
            }
        ],

        // Configure a Rollovermodifier to display metadata
        modifiers: [
            {
                type: EChart2DModifierType.Rollover,
                options: {
                    snapToDataPoint: true,
                    tooltipDataTemplate: seriesInfo => [
                        `X: ${seriesInfo.formattedXValue}`,
                        `Y: ${seriesInfo.formattedYValue}`,
                        `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`
                    ]
                }
            }
        ]
    });
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
