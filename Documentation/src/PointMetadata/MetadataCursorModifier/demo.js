import * as SciChart from "scichart";

async function metadataCursorModifier(divElementId) {
    // #region ExampleA
    // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EllipsePointMarker,
        NumberRange,
        CursorModifier
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // Create metadata with initial values. Metadata can be any JS object
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4.3, 5.3, 6, 6.3, 6.4],
        metadata: [
            { stringValue: "Here's", customValue: 7 },
            undefined, // nothing at this index
            { stringValue: "Some" },
            {}, // empty object at this index
            { stringValue: "Metadata", customValue: 99 }
        ]
    });

    // Add a line series with the metadata
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 11,
                height: 11,
                fill: "#364BA0",
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        })
    );

    // Add a RolloverModifier configured to output X,Y,Metadata.stringValue and customValue
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            snapToDataPoint: true,
            showTooltip: true,
            hitTestRadius: 10,
            tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
                const seriesInfo = seriesInfos?.find(s => s.isHit);
                if (seriesInfo) {
                    // Each element in the array is a line in the tooltip
                    // This can be used to show the data from a single data-point where seriesInfo.isHit = true
                    // or you can return multiple lines for multiple series (1 seriesInfo = 1 series)
                    return [
                        `X: ${seriesInfo.formattedXValue}`,
                        `Y: ${seriesInfo.formattedYValue}`,
                        `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`,
                        `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? "null"}`
                    ];
                }
                return [];
            }
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
            text: "Metadata and CursorModifier Example",
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

metadataCursorModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js with the BuilderAPI
    const { chartBuilder, ESeriesType, EThemeProviderType, EChart2DModifierType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                // Metadata is set in xyData property
                xyData: {
                    xValues: [1, 2, 3, 4, 5],
                    yValues: [4.3, 5.3, 6, 6.3, 6.4],
                    metadata: [
                        { stringValue: "Here's", customValue: 7 },
                        undefined, // nothing at this index
                        { stringValue: "Some" },
                        {}, // empty object at this index
                        { stringValue: "Metadata", customValue: 99 }
                    ]
                },
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
                type: EChart2DModifierType.Cursor,
                options: {
                    snapToDataPoint: true,
                    showTooltip: true,
                    hitTestRadius: 10,
                    tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
                        const seriesInfo = seriesInfos?.find(s => s.isHit);
                        if (seriesInfo) {
                            // Each element in the array is a line in the tooltip
                            // This can be used to show the data from a single data-point where seriesInfo.isHit = true
                            // or you can return multiple lines for multiple series (1 seriesInfo = 1 series)
                            return [
                                `X: ${seriesInfo.formattedXValue}`,
                                `Y: ${seriesInfo.formattedYValue}`,
                                `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`,
                                `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? "null"}`
                            ];
                        }
                        return [];
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
