import {
    applyOpacityToHtmlColor,
    AxisBase2D,
    buildAxes,
    chartBuilder,
    configure2DSurface,
    convertColor,
    DoubleAnimator,
    easing,
    EChart2DModifierType,
    ECoordinateMode,
    GenericAnimation,
    I2DSubSurfaceOptions,
    ISciChart2DDefinition,
    LegendModifier,
    parseColorToTArgb,
    parseTArgbToHtmlColor,
    Rect,
    SciChartSurface,
    TAxisDefinition,
    TBorder,
    TChartTitleStyle,
    TGridLineStyle,
    Thickness,
    TModifierDefinition,
    TSeriesDefinition,
    TTextStyle,
    TTickLineStyle,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { ChartModifierBase2D } from 'scichart/Charting/ChartModifiers/ChartModifierBase2D';

export class GridLayoutModifier extends ChartModifierBase2D {
    public readonly type = 'GridLayoutModifier';
    public isGridProperty: boolean = false;
    public columns: number = 2;
    public transitionDuration = 500;

    public get isGrid() {
        return this.isGridProperty;
    }
    public set isGrid(value: boolean) {
        if (this.isGridProperty !== value) {
            this.isGridProperty = value;
            if (value) {
                this.makeGridLayout();
            } else {
                this.makeSingleChart();
            }
        }
    }

    private getSubChartsAreaRect() {
        const seriesViewRect = this.parentSurface.seriesViewRect;
        const parentXAxis = this.parentSurface.xAxes.get(0);
        const parentYAxis = this.parentSurface.yAxes.get(0);

        const subChartsAreaWidth = seriesViewRect.width + parentYAxis.axisRenderer.viewRect.width;
        const subChartsAreaHeight = seriesViewRect.height + parentXAxis.axisRenderer.viewRect.height;
        return new Rect(seriesViewRect.x, seriesViewRect.y, subChartsAreaWidth, subChartsAreaHeight);
    }

    private makeSubChart(surfaceDef: ISciChart2DDefinition, i: number, width: number, height: number, gap: number) {
        const rs = this.parentSurface.renderableSeries.get(i);
        const rsDef = (surfaceDef.series as TSeriesDefinition[])[i];
        const row = Math.floor(i / this.columns);
        const col = i % this.columns;

        const subChartsAreaRect = this.getSubChartsAreaRect();

        const position = new Rect(
            subChartsAreaRect.x + (col && gap) + col * width,
            subChartsAreaRect.y + (row && gap) + row * height,
            width,
            height
        );

        const borderInitialColor = rs.stroke;

        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${i}`,
            theme: appTheme.SciChartJsTheme,
            // Start full size
            position: subChartsAreaRect,
            coordinateMode: ECoordinateMode.Pixel,
            subChartPadding: Thickness.fromString('0 0 0 0'),
            viewportBorder: {
                color: borderInitialColor,
                borderRight: 2,
                borderLeft: 2,
                borderTop: 2,
                // borderBottom: 2,
            },
            title: rs.dataSeries.dataSeriesName,
            titleStyle: {
                placeWithinChart: true,
                fontSize: 12,
                padding: Thickness.fromString('10 4 0 4'),
                color: appTheme.ForegroundColor,
            },
        };

        const subChart = this.parentSurface.addSubChart(subChartOptions);
        const xAxisDef = (surfaceDef.xAxes as TAxisDefinition[]).find((a) => a.options.id == rs.xAxisId);
        const yAxisDef = (surfaceDef.yAxes as TAxisDefinition[]).find((a) => a.options.id == rs.yAxisId);
        const modifiers = (surfaceDef.modifiers as TModifierDefinition[]).filter(
            (m) => m.type.toString() !== 'GridLayoutModifier' && m.type !== EChart2DModifierType.Legend
        );
        const subSurfaceDef: ISciChart2DDefinition = {
            xAxes: xAxisDef,
            yAxes: yAxisDef,
            series: rsDef,
            modifiers,
        };
        configure2DSurface(subSurfaceDef, subChart, this.parentSurface.webAssemblyContext2D);
        // Share dataSeries
        subChart.renderableSeries.get(0).dataSeries = rs.dataSeries;
        // make series on parent surface invisible
        rs.isVisible = false;

        const xAxis = subChart.xAxes.get(0);
        const yAxis = subChart.yAxes.get(0);

        xAxis.axisTitle = '';
        yAxis.axisTitle = '';

        yAxis.axisBorder = {
            color: borderInitialColor,
            // borderRight: 2,
            borderTop: 2,
            borderBottom: 2,
        };
        xAxis.axisBorder = {
            color: borderInitialColor,
            borderRight: 2,
            borderLeft: 2,
            // borderTop: 2,
            // borderBottom: 2,
        };

        const axisInitialStyles = collectAxisStyles(xAxis);
        const surfaceInitialStyles = collectSurfaceStyles(subChart);
        const positionAnimation = new GenericAnimation<Rect>({
            from: subChart.subPosition,
            to: position,
            onAnimate: (from: Rect, to: Rect, progress: number) => {
                const x = DoubleAnimator.interpolate(from.x, to.x, progress);
                const y = DoubleAnimator.interpolate(from.y, to.y, progress);
                const w = DoubleAnimator.interpolate(from.width, to.width, progress);
                const h = DoubleAnimator.interpolate(from.height, to.height, progress);

                const newPos = new Rect(x, y, w, h);
                subChart.subPosition = newPos;
            },
            onCompleted: () => {},
            duration: (this.transitionDuration * 5) / 6,
            ease: easing.inOutSine,
        });

        const styleAnimation = new GenericAnimation<number>({
            from: 0,
            to: 1,
            onAnimate: (from: number, to: number, progress: number) => {
                const opacity = from + (to - from) * progress;
                multiplyAxisStylesOpacity(xAxis, axisInitialStyles, opacity);
                multiplyAxisStylesOpacity(yAxis, axisInitialStyles, opacity);
                multiplySurfaceStylesOpacity(subChart, surfaceInitialStyles, opacity);
            },
            setInitialValueImmediately: true,
            delay: (this.transitionDuration * 4) / 6,
            onCompleted: () => {},
            duration: this.transitionDuration / 6,
            ease: easing.inOutSine,
        });

        this.parentSurface.addAnimation(positionAnimation, styleAnimation);
    }

    private fadeOutMainSurface() {
        // hide legend
        const legendModifier = this.parentSurface.chartModifiers.getById('LegendModifier') as LegendModifier;
        legendModifier.sciChartLegend.showLegend = false;

        // animation setup to hide main surface
        // assuming the same colors are used for both X and Y axes
        const parentXAxis = this.parentSurface.xAxes.get(0);
        const parentYAxis = this.parentSurface.yAxes.get(0);
        const axisInitialStyles = collectAxisStyles(parentXAxis);

        const onAnimate = (from: number, to: number, progress: number) => {
            const currentOpacity = from + (to - from) * progress;
            multiplyAxisStylesOpacity(parentXAxis, axisInitialStyles, currentOpacity);
            multiplyAxisStylesOpacity(parentYAxis, axisInitialStyles, currentOpacity);
        };

        const mainSurfaceFadeOutAnimation = new GenericAnimation<number>({
            from: 1,
            to: 0,
            onAnimate,
            delay: 0,
            duration: this.transitionDuration / 2,
            ease: easing.linear,
        });
        this.parentSurface.addAnimation(mainSurfaceFadeOutAnimation);
    }

    private fadeInMainSurface() {
        const subCharts = this.parentSurface.subCharts;
        const parentXAxis = this.parentSurface.xAxes.get(0);
        const parentYAxis = this.parentSurface.yAxes.get(0);
        const [firstSubChart] = subCharts;

        // animation setup for making main surface visible
        // assuming the same colors are used for both X and Y axes and for sub-charts
        const subChartAxis = firstSubChart.xAxes.get(0);
        const axisInitialStyles = collectAxisStyles(subChartAxis);

        const mainSurfaceFadeInAnimation = new GenericAnimation<number>({
            from: 0,
            to: 1,
            onAnimate: (from: number, to: number, progress: number) => {
                const currentOpacity = from + (to - from) * progress;

                multiplyAxisStylesOpacity(parentXAxis, axisInitialStyles, currentOpacity);
                multiplyAxisStylesOpacity(parentYAxis, axisInitialStyles, currentOpacity);
            },
            delay: (this.transitionDuration * 2) / 6,
            duration: (this.transitionDuration * 4) / 6,
            ease: easing.linear,
        });

        this.parentSurface.addAnimation(mainSurfaceFadeInAnimation);
    }

    private makeGridLayout() {
        // calculating sizes of sub-charts in grid
        const series = this.parentSurface.renderableSeries.asArray();
        const chartCount = series.length;
        const rows = Math.ceil(chartCount / this.columns);

        const subChartsAreaRect = this.getSubChartsAreaRect();

        const gap = 10;
        const width = (subChartsAreaRect.width - gap * (this.columns - 1)) / this.columns;
        const height = (subChartsAreaRect.height - gap * (rows - 1)) / rows;

        // copying main surface options
        const surfaceDef = this.parentSurface.toJSON(true);

        for (let i = 0; i < chartCount; i++) {
            this.makeSubChart(surfaceDef, i, width, height, gap);
        }

        this.fadeOutMainSurface();
    }

    private makeSingleChart() {
        const subCharts = this.parentSurface.subCharts;
        if (subCharts.length === 0) {
            return;
        }

        this.fadeInMainSurface();

        // Rect defining the size and position of sub-charts grid
        const subChartsAreaRect = this.getSubChartsAreaRect();

        subCharts.forEach((subChart, subChartIndex) => {
            const xAxis = subChart.xAxes.get(0);
            const yAxis = subChart.yAxes.get(0);

            const axisInitialStyles = collectAxisStyles(xAxis);
            const surfaceInitialStyles = collectSurfaceStyles(subChart);

            const subChartRepositioningAnimation = new GenericAnimation<Rect>({
                from: subChart.subPosition,
                to: subChartsAreaRect,
                onAnimate: (from: Rect, to: Rect, progress: number) => {
                    const x = DoubleAnimator.interpolate(from.x, to.x, progress);
                    const y = DoubleAnimator.interpolate(from.y, to.y, progress);
                    const w = DoubleAnimator.interpolate(from.width, to.width, progress);
                    const h = DoubleAnimator.interpolate(from.height, to.height, progress);

                    const newPos = new Rect(x, y, w, h);
                    subChart.subPosition = newPos;
                },
                delay: (this.transitionDuration * 2) / 6,
                duration: (this.transitionDuration * 4) / 6,
                ease: easing.linear,
                onCompleted: () => {
                    // setTimeout is important here to prevent chart flickering
                    setTimeout(() => {
                        // subChart.isVisible = false;
                        const rs = subChart.renderableSeries.get(0);
                        // remove series so it does not get deleted when subchart is deleted
                        rs.dataSeries = undefined;
                        this.parentSurface.removeSubChart(subChart);
                        // make series on parent surface visible
                        this.parentSurface.renderableSeries.get(subChartIndex).isVisible = true;

                        const legendModifier = this.parentSurface.chartModifiers.getById(
                            'LegendModifier'
                        ) as LegendModifier;
                        legendModifier.sciChartLegend.showLegend = true;
                    }, 0);
                },
            });

            const subChartFadeOutAnimation = new GenericAnimation<number>({
                from: 1,
                to: 0,
                onAnimate: (from: number, to: number, progress: number) => {
                    const currentOpacity = from + (to - from) * progress;

                    multiplyAxisStylesOpacity(xAxis, axisInitialStyles, currentOpacity);
                    multiplyAxisStylesOpacity(yAxis, axisInitialStyles, currentOpacity);
                    multiplySurfaceStylesOpacity(subChart, surfaceInitialStyles, currentOpacity);
                },
                delay: 0,
                duration: (this.transitionDuration * 2) / 6,
                ease: easing.linear,
            });

            this.parentSurface.addAnimation(subChartRepositioningAnimation, subChartFadeOutAnimation);
        });
    }
}

type TAxisStyles = {
    labelStyle: TTextStyle;
    majorGridLineStyle: TGridLineStyle;
    minorGridLineStyle: TGridLineStyle;
    majorTickLineStyle: TTickLineStyle;
    minorTickLineStyle: TTickLineStyle;
    axisBandFill: string;
    axisBorderColor: string;
};

type TSurfaceStyles = {
    viewportBorder: TBorder;
    titleStyle: TChartTitleStyle;
};

const collectAxisStyles = (axis: AxisBase2D): TAxisStyles => ({
    labelStyle: axis.labelStyle,
    majorGridLineStyle: axis.majorGridLineStyle,
    minorGridLineStyle: axis.minorGridLineStyle,
    majorTickLineStyle: axis.majorTickLineStyle,
    minorTickLineStyle: axis.minorTickLineStyle,
    axisBandFill: axis.axisBandsFill,
    axisBorderColor: axis.axisBorder.color,
});

const collectSurfaceStyles = (surface: SciChartSurface): TSurfaceStyles => ({
    viewportBorder: surface.viewportBorder,
    titleStyle: surface.titleStyle,
});

const multiplyOpacity = (color: string, opacity: number) => {
    const tarbg = parseColorToTArgb(color);
    tarbg.opacity = Math.floor(opacity * tarbg.opacity);
    return parseTArgbToHtmlColor(tarbg);
};

const multiplyAxisStylesOpacity = (axis: AxisBase2D, initialStyles: TAxisStyles, opacity: number) => {
    axis.labelStyle = { color: multiplyOpacity(initialStyles.labelStyle.color, opacity) };
    axis.majorGridLineStyle = { color: multiplyOpacity(initialStyles.majorGridLineStyle.color, opacity) };
    axis.majorTickLineStyle = { color: multiplyOpacity(initialStyles.majorTickLineStyle.color, opacity) };
    axis.minorGridLineStyle = { color: multiplyOpacity(initialStyles.minorGridLineStyle.color, opacity) };
    axis.minorTickLineStyle = { color: multiplyOpacity(initialStyles.minorTickLineStyle.color, opacity) };
    axis.axisBorder = { color: multiplyOpacity(initialStyles.axisBorderColor, opacity) };
    axis.axisBandsFill = multiplyOpacity(initialStyles.axisBandFill, opacity);
};

const multiplySurfaceStylesOpacity = (surface: SciChartSurface, initialStyles: TSurfaceStyles, opacity: number) => {
    surface.viewportBorder = { color: multiplyOpacity(initialStyles.viewportBorder.color, opacity) };
    surface.titleStyle = { color: multiplyOpacity(initialStyles.titleStyle.color, opacity) };
};
