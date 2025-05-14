import * as SciChart from "scichart";

async function basicSeriesSelection(divElementId) {
    // #region ExampleA
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        SeriesSelectionModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a chart with line series with a point-marker
    // Subscribe to onSelected to change the visual of the series when isSelected = true
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
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
            }),
            // using onSelectedChanged callback, change the style of the series on selection
            onSelectedChanged: sourceSeries => {
                sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
                sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
                sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
            }
        })
    );

    // You can also set or access onSelectedChanged via the renderableSeries
    sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
        console.log(`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected`);
    });

    // Add the SeriesSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableHover: false,
            enableSelection: true
        })
    );
    // #endregion

    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click the series to select it and apply selection style",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

basicSeriesSelection("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EPointMarkerType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: [
            {
                type: EChart2DModifierType.SeriesSelection,
                options: {
                    enableHover: false,
                    enableSelection: true
                }
            }
        ],
        series: [
            {
                type: ESeriesType.LineSeries,
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
                    // using onSelectedChanged callback, change the style of the series on selection
                    onSelectedChanged: sourceSeries => {
                        sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
                        sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
                        sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
                    }
                },
                xyData: {
                    dataSeriesName: "Line Series",
                    xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
                }
            }
        ]
    });

    // You can also set or access onSelectedChanged via the renderableSeries
    sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
        console.log(`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected`);
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
