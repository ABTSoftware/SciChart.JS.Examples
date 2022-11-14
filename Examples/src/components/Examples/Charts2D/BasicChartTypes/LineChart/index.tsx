import * as React from "react";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAnimationType } from "scichart/types/AnimationType";
import classes from "../../../../Examples/Examples.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { appTheme } from "../../../theme";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { EHorizontalAnchorPoint } from "scichart/types/AnchorPoint";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { PaletteFactory } from "scichart/Charting/Model/PaletteFactory";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { Thickness } from "scichart/Core/Thickness";
import { SeriesSelectionModifier } from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { EStrokePaletteMode, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { HorizontalLineAnnotation } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { ELabelPlacement } from "scichart/types/LabelPlacement";
import { EDataLabelSkipMode } from "scichart/types/DataLabelSkipMode";
import { EVerticalTextPosition } from "scichart/types/TextPosition";

const divElementId1 = "chart1";
const divElementId2 = "chart2";
const divElementId3 = "chart3";
const divElementId4 = "chart4";
const divElementId5 = "chart5";
const divElementId6 = "chart6";
const divElementId7 = "chart7";
const divElementId8 = "chart8";
const divElementId9 = "chart9";

const drawExample = async () => {
    const createChartCommon = async (divId: string, title: string, isVertical: boolean = false) => {
        // Create a SciChartSurface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
            theme: appTheme.SciChartJsTheme,
            padding: new Thickness(5, 5, 5, 5)
        });

        // Create the X,Y Axis
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { maxAutoTicks: 5 }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { maxAutoTicks: 5, growBy: new NumberRange(0.05, 0.25) })
        );

        // Add title annotation
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: title,
                fontSize: 16,
                textColor: appTheme.ForegroundColor,
                x1: 0.5,
                y1: 0,
                opacity: 0.77,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative
            })
        );

        if (isVertical) {
            // Only for vertical charts, annotation x,y coordinates are treated as swapped
            const titleAnnotation = sciChartSurface.annotations.get(0);
            titleAnnotation.x1 = 0;
            titleAnnotation.y1 = 0.5;
            // We also want our padding on the xaxis at the start for vertical
            sciChartSurface.xAxes.get(0).growBy = new NumberRange(0.2, 0.05);
        }
        return { sciChartSurface, wasmContext };
    };

    const createLineData = (whichSeries: number) => {
        const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);

        return {
            xValues: data.xValues,
            yValues: data.yValues.map(y => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5))
        };
    };

    const initJustLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId1, "Simple Line Chart");

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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        return sciChartSurface;
    };

    const initDigitalLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId2, "Digital (Step) Line Charts");

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
                    strokeThickness: 0
                }),
                animation: {
                    type: EAnimationType.Wave,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500, delay: 200 }
                },
                // Optional DataLabels may be added via this property.
                dataLabels: {
                    style: { fontFamily: "Arial", fontSize: 11, padding: new Thickness(5, 5, 5, 5) },
                    color: appTheme.ForegroundColor,
                    aboveBelow: false,
                    verticalTextPosition: EVerticalTextPosition.Top
                }
            })
        );

        return sciChartSurface;
    };

    const initTooltipsOnLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId3, "Tooltips on Line Charts");

        const { xValues, yValues } = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(25);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: appTheme.VividOrange,
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Wave,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500, delay: 200 }
                }
            })
        );

        // The RolloverModifier adds tooltip behaviour to the chart
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                rolloverLineStroke: appTheme.VividOrange,
                rolloverLineStrokeThickness: 2,
                rolloverLineStrokeDashArray: [2, 2]
            })
        );

        return sciChartSurface;
    };

    const initDashedLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId4, "Dashed Line Charts");

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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 750 }
                }
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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        return sciChartSurface;
    };

    const initPalettedLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId5, "Gradient Line Charts");

        const data = createLineData(3);

        // Returns IStrokePaletteProvider, preconfigured to colour each point with a gradient
        // Can be fully customised to execute any rule on x,y,index or metadata per-point to colour the series
        // See PaletteProvider documentation for more details
        const gradientPalette = PaletteFactory.createGradient(
            wasmContext,
            new GradientParams(new Point(0, 0), new Point(1, 1), [
                { offset: 0, color: appTheme.VividOrange },
                { offset: 0.5, color: appTheme.VividTeal },
                { offset: 1.0, color: appTheme.VividSkyBlue }
            ])
        );

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                paletteProvider: gradientPalette,
                strokeThickness: 5,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        return sciChartSurface;
    };

    const initHoveredLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId6, "Hover/Select Line Charts");

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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 750 }
                }
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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
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
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        // SeriesSelectionModifier adds the hover/select behaviour to the chart
        // This has a global hovered/selected callback and there are also callbacks per-series (see above)
        sciChartSurface.chartModifiers.add(new SeriesSelectionModifier({ enableHover: true, enableSelection: true }));

        sciChartSurface.renderableSeries.get(2).isSelected = true;

        return sciChartSurface;
    };

    const initVerticalLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId7, "Vertical Line Charts", true);

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
                    strokeThickness: 0
                }),
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 400, delay: 250 }
                }
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
                    strokeThickness: 0
                }),
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 400, delay: 250 }
                }
            })
        );

        return sciChartSurface;
    };

    const initGapsInLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId8, "Gaps in Line Charts");

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
            -0.5377044
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
                    strokeThickness: 0
                })
            })
        );

        // Highlight the gaps with annotations stretched vertically
        sciChartSurface.annotations.add(
            new BoxAnnotation({
                x1: 6,
                x2: 8,
                y1: 0.1,
                y2: 1.0,
                yCoordinateMode: ECoordinateMode.Relative,
                fill: appTheme.MutedTeal + "33",
                strokeThickness: 0
            }),
            new BoxAnnotation({
                x1: 17,
                x2: 19,
                y1: 0.1,
                y2: 1,
                yCoordinateMode: ECoordinateMode.Relative,
                fill: appTheme.MutedTeal + "33",
                strokeThickness: 0
            })
        );

        return sciChartSurface;
    };

    const initThresholdedLineCharts = async () => {
        const { sciChartSurface, wasmContext } = await createChartCommon(divElementId9, "Thresholded Line Charts");

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
            }
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
                // dataLabels: {
                //     style: { fontFamily: "Arial", fontSize: 8 },
                //     color: appTheme.PaleSkyBlue,
                //     skipMode: EDataLabelSkipMode.SkipIfOverlapPrevious
                // }
            })
        );

        // Add annotations to show the thresholds
        sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({
                stroke: appTheme.VividTeal,
                strokeDashArray: [2, 2],
                y1: THRESHOLD_HIGH_LEVEL,
                labelPlacement: ELabelPlacement.TopRight,
                labelValue: "High warning",
                axisLabelFill: appTheme.VividTeal,
                showLabel: true
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
                showLabel: true
            })
        );

        return sciChartSurface;
    };

    const charts = await Promise.all([
        initJustLineCharts(),
        initDigitalLineCharts(),
        initTooltipsOnLineCharts(),
        initDashedLineCharts(),
        initPalettedLineCharts(),
        initHoveredLineCharts(),
        initGapsInLineCharts(),
        initVerticalLineCharts(),
        initGapsInLineCharts(),
        initThresholdedLineCharts()
    ]);

    return { charts };
};

// Styles for the 3x3 grid
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: appTheme.DarkIndigo
    },
    flexContainerRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "33%",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        width: "calc(100% - 10px)"
    },
    item: {
        flex: "auto",
        height: "100%",
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [charts, setCharts] = React.useState<SciChartSurface[]>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setCharts(res.charts);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => charts?.forEach(sciChartSurface => sciChartSurface?.delete());
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper} style={{ aspectRatio: "3 / 2" }}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId1} className={localClasses.item} />
                    <div id={divElementId2} className={localClasses.item} />
                    <div id={divElementId3} className={localClasses.item} />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId4} className={localClasses.item} />
                    <div id={divElementId5} className={localClasses.item} />
                    <div id={divElementId6} className={localClasses.item} />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId7} className={localClasses.item} />
                    <div id={divElementId8} className={localClasses.item} />
                    <div id={divElementId9} className={localClasses.item} />
                </div>
            </div>
        </div>
    );
}
