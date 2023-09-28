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
    DataPointSelectionModifier,
    Thickness,
    EBaseType,
    chartBuilder,
    ELegendOrientation,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { GridLayoutModifier } from './GridLayoutModifier';
import { getData, TDataEntry, availableServers, getRequestsNumberPerTimestamp } from './data-generation';
import { TChartConfigFunc, tooltipDataTemplateKey } from './chart-configurations';

// per server
export const createChart4: TChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        padding: Thickness.fromNumber(10),
        title: 'Server Load',
        titleStyle: {
            useNativeText: true,
            padding: Thickness.fromString("15 0 0 0"),
            fontSize: 20,
        },
    });
    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
    });

    const yAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 20,
        },
        growBy: new NumberRange(0, 0.3),
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const data = getData();

    const stackedColumnCollection = new StackedColumnCollection(wasmContext);

    // filtered per server
    const filter = (data: TDataEntry[], server: string) => data.filter((entry) => entry.server === server);

    const seriesFillColors = [appTheme.MutedPink, appTheme.MutedOrange, appTheme.MutedPurple, appTheme.MutedTeal];
    const seriesStrokeColors = [appTheme.VividPink, appTheme.VividOrange, appTheme.VividPurple, appTheme.VividTeal];

    availableServers.forEach((server, index) => {
        const pageData = filter(data, server);
        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: server,
            ...getRequestsNumberPerTimestamp(pageData),
        });

        const rendSeries = new FastMountainRenderableSeries(wasmContext, {
            dataSeries,
            fill: seriesFillColors[index],
            stroke: seriesStrokeColors[index],
            strokeThickness: 2,
            opacity: 0.5,
            pointMarker: new EllipsePointMarker(wasmContext, {
                fill: appTheme.Indigo,
                stroke: appTheme.ForegroundColor,
                opacity: 0,
                width: 10,
                height: 10,
                strokeThickness: 1,
            }),
        });
        sciChartSurface.renderableSeries.add(rendSeries);
    });

    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    const onSelectionChanged = (args: SelectionChangedArgs) => {
        args.allSeries.forEach((series) => {
            if (series.isSelected) {
                series.pointMarker.opacity = series.opacity;
            } else {
                series.pointMarker.opacity = 0;
            }
        });
    };

    const onHoverChanged = (args: HoveredChangedArgs) => {
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

    chartBuilder.registerFunction(EBaseType.OptionFunction, 'onServerSelectionChanged', onSelectionChanged);
    chartBuilder.registerFunction(EBaseType.OptionFunction, 'onServerHoverChanged', onHoverChanged);

    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true,
        onHoverChanged: 'onServerHoverChanged',
        onSelectionChanged: 'onServerSelectionChanged',
    });

    sciChartSurface.chartModifiers.add(
        seriesSelectionModifier,
        new LegendModifier({ id: 'LegendModifier', 
        orientation: ELegendOrientation.Horizontal,
        placement: ELegendPlacement.TopRight,  showCheckboxes: true }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),

        new RolloverModifier({
            id: 'ServerLoadCursorModifier',
            tooltipDataTemplate: tooltipDataTemplateKey,
            showTooltip: true,
            showRolloverLine: false,
        })
    );

    const glm = new GridLayoutModifier({ id: 'GridLayoutModifier' });
    sciChartSurface.chartModifiers.add(glm);

    sciChartSurface.zoomExtents();
    xAxis.visibleRangeLimit = xAxis.visibleRange;

    const updateData = (data: TDataEntry[]) => {
        availableServers.forEach((server, index) => {
            const serverData = filter(data, server);
            const rendSeries = sciChartSurface.renderableSeries.get(index);
            const oldDataSeries = rendSeries.dataSeries;
            const dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: server,
                ...getRequestsNumberPerTimestamp(serverData),
            });
            rendSeries.dataSeries = dataSeries;
            oldDataSeries.delete();
        });
    };

    return { sciChartSurface, updateData };
};
