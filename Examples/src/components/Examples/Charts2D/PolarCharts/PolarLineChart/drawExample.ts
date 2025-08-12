import {
    EAxisAlignment,
    EllipsePointMarker,
    EPolarAxisMode,
    NumberRange,
    PolarNumericAxis,
    SciChartPolarSurface,
    Thickness,
    XyDataSeries,
    PolarPanModifier,
    PolarMouseWheelZoomModifier,
    RadianLabelProvider,
    PolarLineRenderableSeries,
    PolarZoomExtentsModifier,
    SweepAnimation,
    DefaultPaletteProvider,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    EDataLabelSkipMode,
    PolarCursorModifier,
} from "scichart";
import { appTheme } from "../../../theme";

const COMMON_POLAR_SURFACE_OPTIONS = {
    theme: appTheme.SciChartJsTheme,
    padding: new Thickness(0, 0, 0, 0),
    titleStyle: {
        fontSize: 18,
    },
};

const COMMON_ANGULAR_AXIS_OPTIONS = {
    polarAxisMode: EPolarAxisMode.Angular,
    axisAlignment: EAxisAlignment.Top,

    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,

    labelPrecision: 0,
    useNativeText: true,
};

const COMMON_RADIAL_AXIS_OPTIONS = {
    polarAxisMode: EPolarAxisMode.Radial,
    axisAlignment: EAxisAlignment.Left,

    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,

    labelPrecision: 0,
    useNativeText: true,

    // zoomExtentsToInitialRange: true,
};

export const getChartsInitializationAPI = () => {
    const line1 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Simple Polar Lines",
        });

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,

            autoTicks: false,
            majorDelta: 2,

            startAngle: Math.PI / 2, // place labels at 12 o'clock
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            autoTicks: false,
            majorDelta: 30,

            visibleRange: new NumberRange(0, 360),
            labelPostfix: "°",

            startAngle: Math.PI / 2, // Start drawing at 12 o'clock
            flippedCoordinates: true, // go clockwise

            zoomExtentsToInitialRange: true, // make sure the visibleRange stays fixed, in `zoomExtents` event case
        });
        sciChartSurface.xAxes.add(angularXAxis);

        // Add SERIES
        const xValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
        const polarLine1 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [0, 1, 2, 3, 4, 5, 6, 4, 5, 3, 3],
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        const polarLine2 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [2, 3, 4, 3, 2, 3, 4, 5, 6, 5, 4],
            }),
            stroke: appTheme.VividTeal + "88",
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        sciChartSurface.renderableSeries.add(polarLine1, polarLine2);

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        return { sciChartSurface, wasmContext };
    };

    const line2 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Line Function Traces",
        });

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            drawLabels: false,
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, Math.PI * 2), // Full trigonometric circle

            labelProvider: new RadianLabelProvider({
                maxDenominator: 6,
            }),
            autoTicks: false,
            majorDelta: Math.PI / 6, // needed by RadianLabelProvider to show PI fractions
        });
        sciChartSurface.xAxes.add(angularXAxis);

        function generatePolarTraces(numPoints: number = 300) {
            const theta: number[] = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * (2 * Math.PI));

            // Normalize function
            function normalizeY(data: number[]) {
                const minY = Math.min(...data);
                const maxY = Math.max(...data);
                return data.map((d) => (d - minY) / (maxY - minY));
            }

            // Butterfly Curve
            const butterfly = normalizeY(
                theta.map((t) => Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5))
            );

            // Rose Curve
            const roseCurve = normalizeY(theta.map((t) => Math.cos(12 * t)));

            // Deltoid Curve
            const deltoid = normalizeY(theta.map((t) => 2 * (1 - Math.cos(2 * t))));

            // Archimedean Spiral
            const archimedeanSprial = normalizeY(theta.map((t) => t / (2 * Math.PI)));

            return {
                xValues: theta,
                data: [
                    {
                        name: "Rose",
                        yValues: roseCurve,
                        color: appTheme.VividTeal + "66",
                    },
                    {
                        name: "Butterfly",
                        yValues: butterfly,
                        color: appTheme.VividOrange,
                    },
                    // {
                    //     name: "Deltoid",
                    //     yValues: deltoid,
                    //     color: appTheme.VividPink,
                    // },
                    // {
                    //     name: "Archimedean Spiral",
                    //     yValues: archimedeanSprial,
                    //     color: appTheme.VividBlue,
                    // },
                ],
            };
        }

        // Add SERIES
        const TRACES = generatePolarTraces();
        TRACES.data.forEach((dataset, i) => {
            const polarLine = new PolarLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: TRACES.xValues,
                    yValues: dataset.yValues,
                    dataSeriesName: dataset.name,
                }),
                stroke: dataset.color,
                strokeThickness: 4,
                animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
            });
            sciChartSurface.renderableSeries.add(polarLine);
        });

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        return { sciChartSurface, wasmContext };
    };

    const line3 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Interpolation and pointmarkers",
        });

        const NR_POINTS = 31;
        const OFFSET = 20;

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, NR_POINTS + OFFSET),
            zoomExtentsToInitialRange: true,
            drawLabels: false,
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,
            zoomExtentsToInitialRange: true,
        });
        sciChartSurface.xAxes.add(angularXAxis);

        // Add SERIES
        const xValues = Array.from({ length: NR_POINTS }, (_, i) => i);

        const polarLine = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xValues,
                yValues: Array.from({ length: NR_POINTS }, (_, i) => i + OFFSET),
            }),
            stroke: appTheme.VividTeal + "88",
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                stroke: appTheme.VividTeal,
                fill: appTheme.DarkIndigo,
            }),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
            interpolateLine: true,
        });
        sciChartSurface.renderableSeries.add(polarLine);

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        sciChartSurface.zoomExtents();

        return { sciChartSurface, wasmContext };
    };

    const line4 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Y Palette Provider",
        });

        const TOTAL_DEGREES = 45;
        const POINTS_PER_DEGREE = 2;

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            visibleRange: new NumberRange(0, 6),

            zoomExtentsToInitialRange: true,
            autoTicks: false,
            majorDelta: 1,
            innerRadius: 0.1,
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            autoTicks: false,
            majorDelta: 5,

            visibleRange: new NumberRange(0, TOTAL_DEGREES),
            labelPostfix: "°",

            flippedCoordinates: true, // go clockwise
            startAngle: 0, // Start drawing at 12 o'clock, since flippedCoordinates == true
            totalAngle: Math.PI / 2, // Quarter circle

            zoomExtentsToInitialRange: true, // make sure the visibleRange stays fixed, in `zoomExtents` event case
        });
        sciChartSurface.xAxes.add(angularXAxis);

        // Custom PaletteProvider for line series which colours datapoints under and above a threshold
        class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
            private readonly stroke: number;
            private readonly rule: (yValue: number) => boolean;

            constructor(stroke: string, rule: (yValue: number) => boolean) {
                super();
                this.strokePaletteMode = EStrokePaletteMode.GRADIENT;
                this.rule = rule;
                this.stroke = parseColorToUIntArgb(stroke);
            }

            // This function is called for every data-point.
            // Return undefined to use the default color for the line,
            // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
            overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
                return this.rule(yValue) ? this.stroke : undefined;
            }
        }

        // Add SERIES
        const xValues = Array.from({ length: TOTAL_DEGREES * POINTS_PER_DEGREE }, (_, i) => i / POINTS_PER_DEGREE);

        const polarLine1 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: Array.from({ length: TOTAL_DEGREES * POINTS_PER_DEGREE }, (_, i) => {
                    return Math.sin((i * Math.PI) / 12) + 4.5;
                }),
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
            paletteProvider: new ThresholdLinePaletteProvider("white", (yValue) => yValue > 4 && yValue < 5),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        const polarLine2 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: Array.from({ length: TOTAL_DEGREES * POINTS_PER_DEGREE }, (_, i) => {
                    return Math.sin((i * Math.PI) / 12) + 2.5;
                }),
            }),
            stroke: appTheme.VividTeal + "88",
            strokeThickness: 4,
            paletteProvider: new ThresholdLinePaletteProvider("white", (yValue) => yValue > 2 && yValue < 3),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });
        sciChartSurface.renderableSeries.add(polarLine1, polarLine2);

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        return { sciChartSurface, wasmContext };
    };

    const line5 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "DataLabels",
        });

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,

            // gridlineMode: EPolarGridlineMode.Polygons,
            drawLabels: false,

            autoTicks: false,
            majorDelta: 1,
            visibleRange: new NumberRange(0, 5),
            zoomExtentsToInitialRange: true,
            majorGridLineStyle: {
                color: appTheme.DarkIndigo,
                strokeThickness: 1,
            },
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, Math.PI * 2), // Full trigonometric circle
            zoomExtentsToInitialRange: true,

            labelProvider: new RadianLabelProvider({
                maxDenominator: 4,
                labelPrecision: 2,
            }),

            majorGridLineStyle: {
                color: appTheme.DarkIndigo,
                strokeThickness: 1,
            },
            autoTicks: false,
            majorDelta: Math.PI / 4, // needed by RadianLabelProvider to show PI fractions
        });
        sciChartSurface.xAxes.add(angularXAxis);

        // Add line:
        const line = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 9 }, (_, i) => (i * Math.PI) / 4),
                yValues: [4, 4.2, 3.5, 1.6, 3.8, 4, 1.8, 4, 2],
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
            dataLabels: {
                color: "white",
                style: {
                    fontSize: 10,
                },
                horizontalTextPosition: EHorizontalTextPosition.Center,
                verticalTextPosition: EVerticalTextPosition.Center,
                skipMode: EDataLabelSkipMode.ShowAll,
            },
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 18,
                height: 18,
                stroke: appTheme.VividOrange,
                fill: appTheme.DarkIndigo,
                strokeThickness: 1,
            }),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });
        sciChartSurface.renderableSeries.add(line);

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        return { sciChartSurface, wasmContext };
    };

    const line6 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "X Palette Provider",
        });

        const NR_POINTS = 40;
        const OFFSET = 30;

        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, NR_POINTS + OFFSET),
            zoomExtentsToInitialRange: true,
            drawLabels: false,
        });
        sciChartSurface.yAxes.add(radialYAxis);

        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,
            zoomExtentsToInitialRange: true,
            flippedCoordinates: true, // go clockwise
            startAngle: Math.PI / 2, // Start drawing at 12 o'clock
        });
        sciChartSurface.xAxes.add(angularXAxis);
        appTheme.SciChartJsTheme.strokePalette;

        class XLinePaletteProvider extends DefaultPaletteProvider {
            private readonly _colors = appTheme.SciChartJsTheme.strokePalette as string[];

            constructor() {
                super();
                this.strokePaletteMode = EStrokePaletteMode.SOLID;
            }

            // This function is called for every data-point.
            // Return undefined to use the default color for the line,
            // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
            overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
                return parseColorToUIntArgb(this._colors[Math.min(Math.floor(index / 2)) % this._colors.length]);
            }
        }

        // Add SERIES
        const polarLine = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: NR_POINTS }, (_, i) => i + 1),
                yValues: Array.from({ length: NR_POINTS }, (_, i) => i + OFFSET),
            }),
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
            paletteProvider: new XLinePaletteProvider(),
        });

        sciChartSurface.renderableSeries.add(polarLine);

        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier(),
            new PolarCursorModifier()
        );

        sciChartSurface.zoomExtents();

        return { sciChartSurface, wasmContext };
    };

    return {
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
    };
};
