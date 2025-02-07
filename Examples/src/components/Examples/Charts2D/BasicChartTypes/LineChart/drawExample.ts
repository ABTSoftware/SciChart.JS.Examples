import {
    BoxAnnotation,
    EAnimationType,
    EAxisAlignment,
    ECoordinateMode,
    EDataLabelSkipMode,
    ELabelPlacement,
    ELineDrawMode,
    EllipsePointMarker,
    EStrokePaletteMode,
    EVerticalTextPosition,
    FastLineRenderableSeries,
    GradientParams,
    HorizontalLineAnnotation,
    IPointMetadata,
    IRenderableSeries,
    IStrokePaletteProvider,
    NumberRange,
    NumericAxis,
    PaletteFactory,
    parseColorToUIntArgb,
    Point,
    RolloverModifier,
    SciChartSurface,
    SeriesSelectionModifier,
    Thickness,
    VerticalSliceModifier,
    XyDataSeries,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";

export const getChartsInitializationAPI = () => {
    const createChartCommon = async (divId: string | HTMLDivElement, title: string, isVertical: boolean = false) => {
        // Create a SciChartSurface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
            theme: appTheme.SciChartJsTheme,
            padding: new Thickness(5, 5, 5, 5),
            title,
            disableAspect: true,
            titleStyle: {
                placeWithinChart: true,
                color: appTheme.ForegroundColor + "C4",
                fontSize: 16,
            },
        });

        sciChartSurface.background = "transparent";

        const xAxis = new NumericAxis(wasmContext, { maxAutoTicks: 5 });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, { maxAutoTicks: 5, growBy: new NumberRange(0.05, 0.25) });
        sciChartSurface.yAxes.add(yAxis);

        xAxis.isVisible = false;
        yAxis.isVisible = false;

        if (isVertical) {
            // We also want our padding on the xaxis at the start for vertical
            sciChartSurface.xAxes.get(0).growBy = new NumberRange(0.2, 0.05);
        }
        return { sciChartSurface, wasmContext };
    };

    const createLineData = (whichSeries: number) => {
        const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);

        return {
            xValues: data.xValues,
            yValues: data.yValues.map((y) => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5)),
        };
    };

    const initJustLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Simple Line Chart");

        let data = createLineData(2);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 1,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        data = createLineData(0);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividTeal,
                strokeThickness: 3,
                opacity: 1,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initDigitalLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Digital (Step) Line Charts");

        const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const yValues = [1, 2, 3, 2, 0.5, 1, 2.5, 1, 1];

        // Create the Digital Line chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                // Digital (step) lines are enabled by setting isDigitalLine: true
                isDigitalLine: true,
                // Optional pointmarkers may be added via this property.
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 9,
                    height: 9,
                    fill: appTheme.ForegroundColor,
                    strokeThickness: 0,
                }),
                animation: {
                    type: EAnimationType.Wave,
                    options: { duration: 500, delay: 200 },
                },
                // Optional DataLabels may be added via this property.
                dataLabels: {
                    style: { fontFamily: "Arial", fontSize: 11, padding: new Thickness(5, 5, 5, 5) },
                    color: appTheme.ForegroundColor,
                    aboveBelow: false,
                    verticalTextPosition: EVerticalTextPosition.Above,
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initTooltipsOnLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Tooltips on Line Charts");

        const { xValues, yValues } = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(25);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Wave,
                    options: { duration: 500, delay: 200 },
                },
            })
        );

        // The RolloverModifier adds tooltip behaviour to the chart
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                rolloverLineStroke: appTheme.VividOrange,
                rolloverLineStrokeThickness: 2,
                rolloverLineStrokeDashArray: [2, 2],
            }),
            new VerticalSliceModifier({
                rolloverLineStroke: appTheme.VividOrange,
                rolloverLineStrokeThickness: 2,
                xCoordinateMode: ECoordinateMode.DataValue,
                x1: 15,
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initDashedLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Dashed Line Charts");

        // Create some xValues, yValues arrays
        let data = createLineData(0);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                // Dashed line charts are enabled by setting the StrokeDashArray property. The array defines draw & gap pixel length
                strokeDashArray: [2, 2],
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 750 },
                },
            })
        );

        data = createLineData(1);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 0.77,
                strokeDashArray: [3, 3],
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        data = createLineData(2);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 0.55,
                strokeDashArray: [10, 5],
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initPalettedLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Gradient Line Charts");

        const data = createLineData(3);

        // Returns IStrokePaletteProvider, preconfigured to colour each point with a gradient
        // Can be fully customised to execute any rule on x,y,index or metadata per-point to colour the series
        // See PaletteProvider documentation for more details
        const xGradientPalette = PaletteFactory.createGradient(
            wasmContext,
            new GradientParams(new Point(0, 0), new Point(1, 1), [
                { offset: 0, color: appTheme.VividOrange },
                { offset: 0.5, color: appTheme.VividTeal },
                { offset: 1.0, color: appTheme.VividSkyBlue },
            ])
        );

        // Y gradient
        const yGradientPalette = PaletteFactory.createYGradient(
            wasmContext,
            new GradientParams(new Point(0, 0), new Point(1, 1), [
                { offset: 0, color: appTheme.VividOrange },
                { offset: 0.5, color: appTheme.VividSkyBlue },
                { offset: 1, color: appTheme.VividTeal },
            ]),
            new NumberRange(2, 4) // the range of y-values to apply the gradient to
        );

        // decresing Sine wave
        var yValues = [];
        for (var i = 0; i < 75; i++) {
            yValues.push(3 + Math.sin((i * Math.PI) / 16) * (2 - i / 50));
        }

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                paletteProvider: xGradientPalette,
                strokeThickness: 5,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            }),

            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: yValues }),
                paletteProvider: yGradientPalette,
                strokeThickness: 5,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initHoveredLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Hover/Select Line Charts");

        // Create some xValues, yValues arrays
        let data = createLineData(0);

        const onHoveredChanged = (series: IRenderableSeries, isHovered: boolean) => {
            series.opacity = isHovered ? 1.0 : 0.7;
            series.strokeThickness = isHovered ? 4 : 3;
        };

        const onSelectedChanged = (series: IRenderableSeries, isSelected: boolean) => {
            series.strokeThickness = isSelected ? 5 : 3;
            series.stroke = isSelected ? appTheme.VividSkyBlue : appTheme.VividOrange;
        };

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 0.7,
                onHoveredChanged,
                onSelectedChanged,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 750 },
                },
            })
        );

        data = createLineData(1);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 0.7,
                onHoveredChanged,
                onSelectedChanged,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        data = createLineData(2);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                opacity: 0.7,
                onHoveredChanged,
                onSelectedChanged,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 500 },
                },
            })
        );

        // SeriesSelectionModifier adds the hover/select behaviour to the chart
        // This has a global hovered/selected callback and there are also callbacks per-series (see above)
        sciChartSurface.chartModifiers.add(new SeriesSelectionModifier({ enableHover: true, enableSelection: true }));

        sciChartSurface.renderableSeries.get(2).isSelected = true;

        return { sciChartSurface, wasmContext };
    };

    const initVerticalLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Vertical Line Charts", true);

        // Setting xAxis.alignment = left/right and yAxis.alignemnt = top/bottom
        // is all that's required to rotate a chart, including all drawing and interactions in scichart
        sciChartSurface.xAxes.get(0).axisAlignment = EAxisAlignment.Right;
        sciChartSurface.yAxes.get(0).axisAlignment = EAxisAlignment.Bottom;

        let data = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(50);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                strokeThickness: 3,
                stroke: appTheme.VividOrange,
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 5,
                    height: 5,
                    fill: appTheme.VividOrange,
                    strokeThickness: 0,
                }),
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 400, delay: 250 },
                },
            })
        );

        data = new RandomWalkGenerator().Seed(12345).getRandomWalkSeries(50);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                strokeThickness: 3,
                stroke: appTheme.VividTeal,
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 5,
                    height: 5,
                    fill: appTheme.VividTeal,
                    strokeThickness: 0,
                }),
                animation: {
                    type: EAnimationType.Sweep,
                    options: { duration: 400, delay: 250 },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initGapsInLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Gaps in Line Charts");

        const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

        // When yValues has NaN in it, LineSeries.drawNaNAs can draw them as gaps or closed lines
        const yValues = [
            0.3933834,
            -0.0493884,
            0.4083136,
            -0.0458077,
            -0.5242618,
            -0.9631066,
            -0.6873195,
            NaN,
            -0.1682597,
            0.1255406,
            -0.0313127,
            -0.3261995,
            -0.5490017,
            -0.2462973,
            0.2475873,
            0.15,
            -0.2443795,
            -0.7002707,
            NaN,
            -1.24664,
            -0.8722853,
            -1.1531512,
            -0.7264951,
            -0.9779677,
            -0.5377044,
        ];

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                strokeThickness: 3,
                stroke: appTheme.VividTeal,
                drawNaNAs: ELineDrawMode.DiscontinuousLine,
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 5,
                    height: 5,
                    fill: appTheme.VividTeal,
                    strokeThickness: 0,
                }),
                animation: {
                    type: EAnimationType.Fade,
                    options: {
                        duration: 400,
                        delay: 250,
                        onCompleted: () => {
                            // Highlight the gaps with annotations stretched vertically
                            sciChartSurface.annotations.add(
                                new BoxAnnotation({
                                    x1: 6,
                                    x2: 8,
                                    y1: 0.1,
                                    y2: 1.0,
                                    yCoordinateMode: ECoordinateMode.Relative,
                                    fill: appTheme.MutedTeal + "33",
                                    strokeThickness: 0,
                                }),
                                new BoxAnnotation({
                                    x1: 17,
                                    x2: 19,
                                    y1: 0.1,
                                    y2: 1,
                                    yCoordinateMode: ECoordinateMode.Relative,
                                    fill: appTheme.MutedTeal + "33",
                                    strokeThickness: 0,
                                })
                            );
                        },
                    },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const initThresholdedLineCharts = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await createChartCommon(rootElement, "Thresholded Line Charts");

        const { xValues, yValues } = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(50);

        const THRESHOLD_HIGH_LEVEL = 0;
        const THRESHOLD_LOW_LEVEL = -2;
        const THRESHOLD_LOW_COLOR_ARGB = parseColorToUIntArgb(appTheme.VividPink);
        const THRESHOLD_HIGH_COLOR_ARGB = parseColorToUIntArgb(appTheme.VividTeal);

        // PaletteProvider API allows for per-point colouring, filling of points based on a rule
        // see PaletteProvider API for more details
        const paletteProvider: IStrokePaletteProvider = {
            strokePaletteMode: EStrokePaletteMode.GRADIENT,
            onAttached(parentSeries: IRenderableSeries): void {},
            onDetached(): void {},
            // This function called once per data-point. Colors returned must be in ARGB format (uint) e.g. 0xFF0000FF is Red
            overrideStrokeArgb(
                xValue: number,
                yValue: number,
                index: number,
                opacity?: number,
                metadata?: IPointMetadata
            ): number {
                if (yValue < THRESHOLD_LOW_LEVEL) {
                    return THRESHOLD_LOW_COLOR_ARGB;
                }
                if (yValue > THRESHOLD_HIGH_LEVEL) {
                    return THRESHOLD_HIGH_COLOR_ARGB;
                }
                // Undefined means use default series stroke on this data-point
                return undefined;
            },
        };

        // Create a line series with threshold palette provider
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                strokeThickness: 3,
                stroke: appTheme.VividOrange,
                // paletteprovider allows per-point colouring
                paletteProvider,
                // Datalabels may be shown using this property
                dataLabels: {
                    style: { fontFamily: "Arial", fontSize: 8 },
                    color: appTheme.PaleSkyBlue,
                    skipMode: EDataLabelSkipMode.SkipIfOverlapPrevious,
                },
                animation: {
                    type: EAnimationType.Wave,
                    options: {
                        duration: 400,
                        delay: 250,
                        onCompleted: () => {
                            // Add annotations to show the thresholds
                            sciChartSurface.annotations.add(
                                new HorizontalLineAnnotation({
                                    stroke: appTheme.VividTeal,
                                    strokeDashArray: [2, 2],
                                    y1: THRESHOLD_HIGH_LEVEL,
                                    labelPlacement: ELabelPlacement.TopRight,
                                    labelValue: "High warning",
                                    axisLabelFill: appTheme.VividTeal,
                                    showLabel: true,
                                })
                            );
                            sciChartSurface.annotations.add(
                                new HorizontalLineAnnotation({
                                    stroke: appTheme.VividPink,
                                    strokeDashArray: [2, 2],
                                    labelPlacement: ELabelPlacement.BottomLeft,
                                    y1: THRESHOLD_LOW_LEVEL,
                                    labelValue: "Low warning",
                                    axisLabelFill: appTheme.VividPink,
                                    showLabel: true,
                                })
                            );
                        },
                    },
                },
            })
        );

        return { sciChartSurface, wasmContext };
    };

    return {
        initJustLineCharts,
        initDigitalLineCharts,
        initTooltipsOnLineCharts,
        initDashedLineCharts,
        initPalettedLineCharts,
        initHoveredLineCharts,
        initGapsInLineCharts,
        initVerticalLineCharts,
        initThresholdedLineCharts,
    };
};
