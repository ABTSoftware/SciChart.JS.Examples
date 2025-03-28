import * as SciChart from "scichart";

const xValues = [];
const yValues = [];
const yValues1 = [];
const yValues2 = [];
for (let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    yValues1.push(0.1 * Math.sin(i * 0.3) - Math.cos(i * 0.02));
    yValues2.push(0.1 * Math.sin(i * 0.7) - Math.cos(i * 0.03));
}

async function simpleSubChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to use the Sub-Charts API to create child charts in a parent chart
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        Rect,
        ECoordinateMode,
        ZoomPanModifier,
        ZoomExtentsModifier,
        MouseWheelZoomModifier,
        BoxAnnotation,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Function to add series to chart. This will be re-used for the parent and sub-charts
    const addSeries = (sciChartSurface, stroke, x, y) => {
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                stroke,
                strokeThickness: 5,
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: x,
                    yValues: y
                }),
                opacity: sciChartSurface.isSubSurface ? 0.5 : 1
            })
        );
    };

    // Create a parent (regular) SciChartSurface which will contain the sub-chart
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Create X,Y axis on the parent chart and programmatically zoom into part of the data
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Create a series on the parent chart
    addSeries(sciChartSurface, "#FF6600", xValues, yValues);
    addSeries(sciChartSurface, "#ae418d", xValues, yValues1);
    addSeries(sciChartSurface, "#47bde6", xValues, yValues2);

    // Add some interactivity to the parent chart
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart
    const subChart1 = sciChartSurface.addSubChart({
        // Properties from I2DSubSurfaceOptions affect positioning and rendering of the subchart
        position: new Rect(0.02, 0.02, 0.4, 0.4),
        isTransparent: false,
        isVisible: true,
        coordinateMode: ECoordinateMode.Relative,
        // However all properties from I2DSurfaceOptions are available
        viewportBorder: { border: 3, color: "#77777777" },
        backgroundColor: "#333",
        title: "2D Overview with Sub-Charts",
        titleStyle: { fontSize: 16, color: "#eeeeee77" }
    });

    // Add x,y axis to the subchart
    subChart1.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
    subChart1.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    addSeries(subChart1, "#FF6600", xValues, yValues);
    addSeries(subChart1, "#ae418d", xValues, yValues1);
    addSeries(subChart1, "#47bde6", xValues, yValues2);

    // Add a BoxAnnotation to the SubChart
    const boxAnnotation = new BoxAnnotation({
        fill: "#FF660033",
        stroke: "#FF6600",
        strokeThickness: 2,
        opacity: 0.5
    });
    subChart1.annotations.add(boxAnnotation);

    // On parent chart zoom, pan, update the box annotation on the subchart
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe(args => {
        boxAnnotation.x1 = args.visibleRange.min;
        boxAnnotation.x2 = args.visibleRange.max;
    });
    sciChartSurface.yAxes.get(0).visibleRangeChanged.subscribe(args => {
        boxAnnotation.y1 = args.visibleRange.min;
        boxAnnotation.y2 = args.visibleRange.max;
    });

    // On the parent chart, programmatically zoom into a region
    setTimeout(() => {
        sciChartSurface.xAxes.get(0).animateVisibleRange(new NumberRange(30, 70), 1000);
        sciChartSurface.yAxes.get(0).animateVisibleRange(new NumberRange(-0.4, 0.4), 1000);
    }, 1000);
    // #endregion

    const { TextAnnotation, EHorizontalAnchorPoint } = SciChart; // Add a watermark to explain what's going on
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.5,
            y1: 0.5,
            text: "Mousewheel/Drag the parent chart to update the subchart view rect",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            opacity: 0.5,
            fontSize: 20
        })
    );
}

simpleSubChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const {
        chartBuilder,
        ESeriesType,
        EAxisType,
        EThemeProviderType,
        Rect,
        ECoordinateMode,
        EAnnotationType,
        NumberRange,
        EChart2DModifierType
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        // Main chart definition is here
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues: yValues1
                },
                options: {
                    stroke: "#0066FF",
                    strokeThickness: 5
                }
            }
        ],
        modifiers: [
            { type: EChart2DModifierType.ZoomPan },
            { type: EChart2DModifierType.ZoomExtents },
            { type: EChart2DModifierType.MouseWheelZoom }
        ],
        // Subchart definition is here
        subCharts: [
            {
                surface: {
                    // Properties from I2DSubSurfaceOptions affect positioning and rendering of the subchart
                    position: new Rect(0.02, 0.02, 0.4, 0.4),
                    isTransparent: false,
                    isVisible: true,
                    coordinateMode: ECoordinateMode.Relative,
                    // However all properties from I2DSurfaceOptions are available
                    viewportBorder: { border: 3, color: "#77777777" },
                    backgroundColor: "#333",
                    title: "2D Overview with Sub-Charts",
                    titleStyle: { fontSize: 16, color: "#eeeeee77" }
                },
                // Define the x,y axis on Subchart
                xAxes: { type: EAxisType.NumericAxis, options: { isVisible: false } },
                yAxes: { type: EAxisType.NumericAxis, options: { isVisible: false } },
                // Define the series on Subchart
                series: [
                    {
                        type: ESeriesType.LineSeries,
                        xyData: {
                            xValues,
                            yValues: yValues1
                        },
                        options: {
                            stroke: "#0066FF",
                            strokeThickness: 5
                        }
                    }
                ],
                annotations: [
                    {
                        type: EAnnotationType.RenderContextBoxAnnotation,
                        options: {
                            fill: "#FF660033",
                            stroke: "#FF6600",
                            strokeThickness: 2,
                            opacity: 0.5
                        }
                    }
                ]
            }
        ]
    });

    // On parent chart zoom, pan, update the box annotation on the subchart
    const subChartBoxAnnotation = sciChartSurface.subCharts.at(0).annotations.get(0);
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe(args => {
        subChartBoxAnnotation.x1 = args.visibleRange.min;
        subChartBoxAnnotation.x2 = args.visibleRange.max;
    });
    sciChartSurface.yAxes.get(0).visibleRangeChanged.subscribe(args => {
        subChartBoxAnnotation.y1 = args.visibleRange.min;
        subChartBoxAnnotation.y2 = args.visibleRange.max;
    });

    // On the parent chart, programmatically zoom into a region
    setTimeout(() => {
        sciChartSurface.xAxes.get(0).animateVisibleRange(new NumberRange(30, 70), 1000);
        sciChartSurface.yAxes.get(0).animateVisibleRange(new NumberRange(-0.4, 0.4), 1000);
    }, 1000);
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
