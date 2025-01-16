import {
    SciChartSurface,
    NumericAxis,
    ENumericFormat,
    NumberRange,
    StackedColumnCollection,
    XyDataSeries,
    FastMountainRenderableSeries,
    WaveAnimation,
    LegendModifier,
    ELegendPlacement,
    ZoomExtentsModifier,
    EXyDirection,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    RolloverModifier,
    SeriesSelectionModifier,
    HoveredChangedArgs,
    SelectionChangedArgs,
    GenericAnimation,
    EllipsePointMarker,
    Thickness,
    EBaseType,
    chartBuilder,
    ELegendOrientation,
    TCheckedChangedArgs,
    GradientParams,
    Point,
} from "scichart";
import { appTheme } from "../../../theme";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { getData, TDataEntry, availableServers, getRequestsNumberPerTimestamp } from "./data-generation";
import { TChartViewOptions, tooltipDataTemplateKey } from "./chart-configurations";

export const createServerLoadChart = async (divElementId: string | HTMLDivElement, options: TChartViewOptions) => {
    const { isMobileView, isLargeView } = options;

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        padding: Thickness.fromNumber(10),
        title: "Server Load",
        titleStyle: {
            useNativeText: true,
            placeWithinChart: !isLargeView,
            padding: Thickness.fromString("15 0 0 0"),
            fontSize: 16,
            color: appTheme.ForegroundColor,
        },
    });
    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        labelStyle: {
            fontSize: isLargeView ? 12 : 10,
        },
        labelFormat: ENumericFormat.Date_DDMM,
        // useNativeText: true,
    });

    const yAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        axisTitle: isLargeView ? "Requests" : undefined,
        axisTitleStyle: {
            fontSize: 20,
            color: appTheme.ForegroundColor,
        },
        labelStyle: {
            fontSize: isLargeView ? 10 : 12,
        },
        keepLabelsWithinAxis: false,
        useNativeText: true,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const data = getData();

    // filtered per server
    const filter = (data: TDataEntry[], server: string) => data.filter((entry) => entry.server === server);

    const seriesFillColors = ["#f6086c", "#9002a1", "#47bde6", "#34c19c"];
    const seriesStrokeColors = ["#f6086c", "#9002a1", "#47bde6", "#34c19c"];

    availableServers.forEach((server, index) => {
        const pageData = filter(data, server);
        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: server,
            containsNaN: false,
            dataEvenlySpacedInX: true,
            isSorted: true,
            ...getRequestsNumberPerTimestamp(pageData),
        });

        const rendSeries = new FastMountainRenderableSeries(wasmContext, {
            dataSeries,
            fill: seriesFillColors[index],
            stroke: seriesStrokeColors[index] + "AA",
            strokeThickness: 4,
            opacity: 0.5,
            pointMarker: new EllipsePointMarker(wasmContext, {
                fill: appTheme.Indigo,
                stroke: appTheme.ForegroundColor,
                opacity: 0,
                width: 10,
                height: 10,
                strokeThickness: 1,
            }),
            animation: new WaveAnimation({ duration: 1000, fadeEffect: true }),
        });
        sciChartSurface.renderableSeries.add(rendSeries);
    });

    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true,
        onHoverChanged: "onServerHoverChanged",
        onSelectionChanged: "onServerSelectionChanged",
    });

    const legendModifier = new LegendModifier({
        id: "LegendModifier",
        showLegend: isLargeView,
        orientation: ELegendOrientation.Horizontal,
        placement: ELegendPlacement.TopRight,
        showCheckboxes: true,
        backgroundColor: "#0d1523",
    });

    legendModifier.isEnabled = isLargeView;

    const rolloverModifier = new RolloverModifier({
        id: "ServerLoadCursorModifier",
        tooltipDataTemplate: tooltipDataTemplateKey,
        showTooltip: true,
        snapToDataPoint: true,
    });
    rolloverModifier.rolloverLineAnnotation.showLabel = true;
    rolloverModifier.rolloverLineAnnotation.axisLabelFill = "#e8c667";
    rolloverModifier.rolloverLineAnnotation.axisLabelStroke = "#0d1523";
    sciChartSurface.chartModifiers.add(
        seriesSelectionModifier,
        legendModifier,
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ enableZoom: true, xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        rolloverModifier
    );

    const glm = new GridLayoutModifier({ id: "GridLayoutModifier" });
    sciChartSurface.chartModifiers.add(glm);

    sciChartSurface.zoomExtentsX();
    xAxis.visibleRangeLimit = xAxis.visibleRange;

    const adjustYAxisVisibleRange = () => {
        const growFactor = 1.3;
        yAxis.visibleRange = new NumberRange(0, yAxis.getMaximumRange().max * growFactor);
    };

    adjustYAxisVisibleRange();

    const updateData = (data: TDataEntry[]) => {
        availableServers.forEach((server, index) => {
            const serverData = filter(data, server);
            const rendSeries = sciChartSurface.renderableSeries.get(index);
            const dataSeries = rendSeries.dataSeries as XyDataSeries;
            const { xValues, yValues } = getRequestsNumberPerTimestamp(serverData);
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues);

            adjustYAxisVisibleRange();
        });
    };

    const subscribeToServerSelection = (callback: (args: string, isChecked: boolean) => void) => {
        legendModifier.isCheckedChanged.subscribe((args: TCheckedChangedArgs) => {
            const server = args.series.getDataSeriesName();
            callback(server, args.isChecked);
        });
    };

    return { sciChartSurface, updateData, subscribeToServerSelection };
};

export const getServerLoadChartConfig = (options: TChartViewOptions) => async (divElementId: string | HTMLDivElement) =>
    createServerLoadChart(divElementId, options);

const onSelectionChanged = (args: SelectionChangedArgs) => {
    args.allSeries.forEach((series) => {
        if (series.isSelected) {
            console.log("onSelectionChanged");
            series.pointMarker.opacity = series.opacity;
        } else {
            series.pointMarker.opacity = 0;
        }
    });
};

const onHoverChanged = (args: HoveredChangedArgs) => {
    const sciChartSurface = args.source.parentSurface;
    const hoverAnimationDuration = 500;
    args.allSeries.forEach((series) => {
        if (series.isHovered) {
            sciChartSurface.addAnimation(
                new GenericAnimation({
                    from: series.opacity,
                    to: 0.8,
                    duration: hoverAnimationDuration,
                    onAnimate: (from, to, progress) => {
                        const opacity = (to - from) * progress + from;
                        series.opacity = opacity;
                        if (series.isSelected) {
                            series.pointMarker.opacity = opacity;
                        }
                    },
                })
            );

            series.strokeThickness = 5;
        } else if (args.hoveredSeries.length > 0) {
            sciChartSurface.addAnimation(
                new GenericAnimation({
                    from: series.opacity,
                    to: 0.3,
                    duration: hoverAnimationDuration,
                    onAnimate: (from, to, progress) => {
                        const opacity = (to - from) * progress + from;
                        series.opacity = opacity;
                        if (series.isSelected) {
                            series.pointMarker.opacity = opacity;
                        }
                    },
                })
            );
            series.strokeThickness = 2;
        } else {
            sciChartSurface.addAnimation(
                new GenericAnimation({
                    from: series.opacity,
                    to: 0.5,
                    duration: hoverAnimationDuration,
                    onAnimate: (from, to, progress) => {
                        const opacity = (to - from) * progress + from;
                        series.opacity = opacity;
                        if (series.isSelected) {
                            series.pointMarker.opacity = opacity;
                        }
                    },
                })
            );
            series.strokeThickness = 2;
        }
    });
};

chartBuilder.registerFunction(EBaseType.OptionFunction, "onServerSelectionChanged", onSelectionChanged);
chartBuilder.registerFunction(EBaseType.OptionFunction, "onServerHoverChanged", onHoverChanged);
