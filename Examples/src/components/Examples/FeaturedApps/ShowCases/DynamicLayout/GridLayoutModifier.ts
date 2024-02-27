import {
    applyOpacityToHtmlColor,
    ChartModifierBase2D,
    configure2DSurface,
    convertColor,
    DoubleAnimator,
    easing,
    ECoordinateMode,
    GenericAnimation,
    I2DSubSurfaceOptions,
    ISciChart2DDefinition,
    parseColorToTArgb,
    parseTArgbToHtmlColor,
    Rect,
    TAxisDefinition,
    Thickness,
    TModifierDefinition,
    TSeriesDefinition,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";

export class GridLayoutModifier extends ChartModifierBase2D {
    public readonly type = "GridLayoutModifier";
    public isGridProperty: boolean = false;
    public columns: number = 2;

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

    private makeSubChart(surfaceDef: ISciChart2DDefinition, i: number, width: number, height: number) {
        const rs = this.parentSurface.renderableSeries.get(i);
        const rsDef = (surfaceDef.series as TSeriesDefinition[])[i];
        const row = Math.floor(i / this.columns);
        const col = i % this.columns;
        const position = new Rect(col * width, row * height, width, height);
        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${i}`,
            theme: appTheme.SciChartJsTheme,
            // Start full size
            position: new Rect(0, 0, 1, 1),
            coordinateMode: ECoordinateMode.Relative,
            subChartPadding: Thickness.fromNumber(3),
            // viewportBorder: {
            //     color: "rgba(150, 74, 148, 0.51)",
            //     border: 2
            // },
            title: rs.dataSeries.dataSeriesName,
            titleStyle: {
                placeWithinChart: true,
                fontSize: 12,
                padding: Thickness.fromString("10 4 0 4"),
                color: appTheme.ForegroundColor,
            },
        };
        const subChart = this.parentSurface.addSubChart(subChartOptions);
        const xAxisDef = (surfaceDef.xAxes as TAxisDefinition[]).find((a) => a.options.id == rs.xAxisId);
        const yAxisDef = (surfaceDef.yAxes as TAxisDefinition[]).find((a) => a.options.id == rs.yAxisId);
        const modifiers = (surfaceDef.modifiers as TModifierDefinition[]).filter(
            (m) => m.type.toString() !== "GridLayoutModifier"
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
        xAxis.drawMinorGridLines = false;
        yAxis.drawMinorGridLines = false;
        const labelColor = xAxis.labelStyle.color;
        const animation = new GenericAnimation<Rect>({
            from: new Rect(0, 0, 1, 1),
            to: position,
            onAnimate: (from: Rect, to: Rect, progress: number) => {
                const x = DoubleAnimator.interpolate(from.x, to.x, progress);
                const y = DoubleAnimator.interpolate(from.y, to.y, progress);
                const w = DoubleAnimator.interpolate(from.width, to.width, progress);
                const h = DoubleAnimator.interpolate(from.height, to.height, progress);
                subChart.viewportBorder = { color: `rgba(150, 74, 148, ${progress * 0.5})`, border: 2 };
                xAxis.labelStyle = { color: applyOpacityToHtmlColor(labelColor, progress) };
                yAxis.labelStyle = { color: applyOpacityToHtmlColor(labelColor, progress) };
                yAxis.drawMinorGridLines = false;
                subChart.titleStyle = { color: applyOpacityToHtmlColor(appTheme.ForegroundColor, progress) };
                const newPos = new Rect(x, y, w, h);
                subChart.subPosition = newPos;
            },
            duration: 500,
            ease: easing.outCubic,
        });
        subChart.addAnimation(animation);
    }

    private makeGridLayout() {
        const series = this.parentSurface.renderableSeries.asArray();
        const chartCount = series.length;
        const rows = Math.ceil(chartCount / this.columns);
        const width = 1 / this.columns;
        const height = 1 / rows;
        const surfaceDef = this.parentSurface.toJSON(true);
        for (let i = 0; i < chartCount; i++) {
            this.makeSubChart(surfaceDef, i, width, height);
        }
        // Set parent axes invisible
        this.parentSurface.xAxes.asArray().forEach((x) => (x.isVisible = false));
        this.parentSurface.yAxes.asArray().forEach((y) => (y.isVisible = false));
    }

    private makeSingleChart() {
        const count = this.parentSurface.subCharts.length;
        for (let i = 0; i < count; i++) {
            const subChart = this.parentSurface.subCharts[i];
            const xAxis = subChart.xAxes.get(0);
            const yAxis = subChart.yAxes.get(0);
            const labelColor = xAxis.labelStyle.color;
            const animation = new GenericAnimation<Rect>({
                from: subChart.subPosition,
                to: new Rect(0, 0, 1, 1),
                onAnimate: (from: Rect, to: Rect, progress: number) => {
                    const x = DoubleAnimator.interpolate(from.x, to.x, progress);
                    const y = DoubleAnimator.interpolate(from.y, to.y, progress);
                    const w = DoubleAnimator.interpolate(from.width, to.width, progress);
                    const h = DoubleAnimator.interpolate(from.height, to.height, progress);
                    subChart.viewportBorder = {
                        color: `rgba(150, 74, 148, ${(1 - progress) * 0.5 + 0.01})`,
                        border: 2,
                    };
                    xAxis.labelStyle = { color: applyOpacityToHtmlColor(labelColor, 1 - progress * 0.99) };
                    yAxis.labelStyle = { color: applyOpacityToHtmlColor(labelColor, 1 - progress * 0.99) };
                    subChart.titleStyle = {
                        color: applyOpacityToHtmlColor(appTheme.ForegroundColor, 1 - progress * 0.99),
                    };
                    const newPos = new Rect(x, y, w, h);
                    subChart.subPosition = newPos;
                },
                duration: 500,
                ease: easing.outCubic,
                onCompleted: () => {
                    subChart.isVisible = false;
                    const rs = subChart.renderableSeries.get(0);
                    // remove series so it does not get deleted when subchart is deleted
                    rs.dataSeries = undefined;
                    this.parentSurface.removeSubChart(subChart);
                    // make series on parent surface visible
                    this.parentSurface.renderableSeries.get(i).isVisible = true;
                },
            });
            this.parentSurface.addAnimation(animation);
        }
        // Set parent axes visible
        this.parentSurface.xAxes.asArray().forEach((x) => (x.isVisible = true));
        this.parentSurface.yAxes.asArray().forEach((y) => (y.isVisible = true));
    }
}
