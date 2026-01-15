import {
    ChartModifierBase2D,
    EModifierType,
    IChartModifierBaseOptions,
    SciChartSubSurface,
    I2DSubSurfaceOptions,
    ESubSurfacePositionCoordinateMode,
    Rect,
    NumericAxis,
    EAutoRange,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    OverviewRangeSelectionModifier,
    ISciChartSubSurface,
    IRenderableSeries,
    buildSeries,
    IOverviewOptions,
    IBaseRenderableSeriesOptions,
} from "scichart";

export interface ISubChartsOverviewModifierOptions extends IChartModifierBaseOptions, IOverviewOptions {
    /** Position of the overview subsurface (default: bottom 20% of the chart) */
    overviewPosition?: Rect;
    /** Whether the overview subsurface should be transparent */
    isTransparent?: boolean;
    /** Overview axis title */
    axisTitle?: string;
    /** Overview axis label style */
    labelStyle?: {
        color?: string;
        fontSize?: number;
    };
    /** Overview axis tick style */
    majorTickLineStyle?: {
        color?: string;
        tickSize?: number;
        strokeThickness?: number;
    };
    /** Y-axis grow by range */
    yAxisGrowBy?: NumberRange;
}

/**
 * A chart modifier that creates an overview subsurface for multiple subcharts.
 * The overview displays all data from subcharts and allows range selection to control zoom on all subcharts.
 */
export class SubChartsOverviewModifier extends ChartModifierBase2D {
    readonly type: EModifierType = "SubChartsOverviewModifier" as EModifierType;

    private options: ISubChartsOverviewModifierOptions;
    private overviewSubSurface: SciChartSubSurface;
    private overviewXAxis: NumericAxis;
    private overviewYAxis: NumericAxis;
    private rangeSelectionModifier: OverviewRangeSelectionModifier;
    private allSubCharts: ISciChartSubSurface[] = [];

    constructor(options?: ISubChartsOverviewModifierOptions) {
        super(options);
        this.options = {
            overviewPosition: new Rect(0, 0.8, 1, 0.2),
            isTransparent: true,
            axisTitle: "Overview - All Charts",
            labelStyle: {
                color: "#ffffff",
                fontSize: 10,
            },
            majorTickLineStyle: {
                color: "#ffffff",
                tickSize: 6,
                strokeThickness: 1,
            },
            yAxisGrowBy: new NumberRange(0.1, 0.1),
            ...options,
        };
    }

    public override onAttach(): void {
        super.onAttach();

        // Wait for the parent surface to be ready
        this.parentSurface.nextStateRender().then(() => this.initializeOverview());
    }

    public override onDetach(): void {
        if (this.overviewSubSurface) {
            this.overviewSubSurface.delete();
        }
        super.onDetach();
    }

    public override onAttachSubSurface(subChart: ISciChartSubSurface): void {
        // Skip the overview subsurface itself
        if (subChart.id === "overviewSubSurface") {
            return;
        }

        this.allSubCharts.push(subChart);

        // If overview is already created, add series from this subchart
        if (this.overviewSubSurface) {
            this.addSeriesToOverview(subChart.renderableSeries.asArray(), subChart.id);
        }

        // Subscribe to series collection changes on this subchart
        subChart.renderableSeries.collectionChanged.subscribe((args) => {
            if (this.overviewSubSurface) {
                // Handle new series
                if (args.getNewItems()) {
                    this.addSeriesToOverview(args.getNewItems(), subChart.id);
                }
                // Handle removed series
                if (args.getOldItems()) {
                    this.removeSeriesFromOverview(args.getOldItems(), subChart.id);
                }
            }
        });
    }

    public override onDetachSubSurface(subChart: ISciChartSubSurface): void {
        const index = this.allSubCharts.indexOf(subChart);
        if (index > -1) {
            this.allSubCharts.splice(index, 1);

            // Remove corresponding series from overview
            if (this.overviewSubSurface) {
                this.removeSeriesFromOverview(subChart.renderableSeries.asArray(), subChart.id);
            }
        }
    }

    public override onAttachSeries(series: IRenderableSeries): void {
        // Handle series attached to main surface
        if (this.overviewSubSurface) {
            this.addSeriesToOverview([series], this.parentSurface.id);
        }
    }

    public override onDetachSeries(series: IRenderableSeries): void {
        // Handle series detached from main surface
        if (this.overviewSubSurface) {
            this.removeSeriesFromOverview([series], this.parentSurface.id);
        }
    }

    private initializeOverview(): void {
        this.createOverviewSubSurface();
        this.addAllSeries();
        this.setupRangeSelection();
    }

    private createOverviewSubSurface(): void {
        const wasmContext = this.parentSurface.webAssemblyContext2D;

        const overviewOptions: I2DSubSurfaceOptions = {
            id: "overviewSubSurface",
            position: this.options.overviewPosition,
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
            isTransparent: this.options.isTransparent,
        };

        this.overviewSubSurface = SciChartSubSurface.createSubSurface(this.parentSurface, overviewOptions);

        // Create axes for the overview
        this.overviewXAxis = new NumericAxis(wasmContext, {
            id: "overviewXAxis",
            isVisible: true,
            autoRange: EAutoRange.Always,
            axisTitle: this.options.axisTitle,
            axisTitleStyle: { fontSize: 14 },
            labelStyle: this.options.labelStyle,
            majorTickLineStyle: this.options.majorTickLineStyle,
        });

        this.overviewYAxis = new NumericAxis(wasmContext, {
            id: "overviewYAxis",
            isVisible: true,
            autoRange: EAutoRange.Always,
            growBy: this.options.yAxisGrowBy,
            labelStyle: {
                color: this.options.labelStyle?.color || "#ffffff",
                fontSize: 8,
            },
        });

        this.overviewSubSurface.xAxes.add(this.overviewXAxis);
        this.overviewSubSurface.yAxes.add(this.overviewYAxis);
    }

    private addAllSeries(): void {
        this.addSeriesToOverview(this.parentSurface.renderableSeries.asArray(), this.parentSurface.id);

        // Collect all existing subcharts and their data
        this.parentSurface.subCharts.forEach((subChart: ISciChartSubSurface) => {
            if (subChart.id !== "overviewSubSurface") {
                // Add to our tracking if not already added
                if (!this.allSubCharts.includes(subChart)) {
                    this.allSubCharts.push(subChart);
                }

                // Collect all data series from this subchart
                this.addSeriesToOverview(subChart.renderableSeries.asArray(), subChart.id);
            }
        });
    }

    private addSeriesToOverview(renderableSeries: IRenderableSeries[], parentId: string): void {
        const wasmContext = this.parentSurface.webAssemblyContext2D;

        let transform = (rendSeries: IRenderableSeries) => {
            // return undefined to skip
            // clone the series using builder api
            const json = rendSeries.toJSON(true);
            (json.options as IBaseRenderableSeriesOptions).id = parentId + "_" + rendSeries.id;
            const [overviewSeries] = buildSeries(wasmContext, json);
            overviewSeries.dataSeries.delete();
            overviewSeries.dataSeries = rendSeries.dataSeries;
            overviewSeries.xAxisId = this.overviewXAxis.id;
            overviewSeries.yAxisId = this.overviewYAxis.id;
            return overviewSeries;
        };

        if (this.options?.transformRenderableSeries) {
            transform = (rs: IRenderableSeries) => this.options?.transformRenderableSeries(rs, this.overviewSubSurface);
        }

        const newSeries = renderableSeries.map(transform).filter((rendSeries: IRenderableSeries) => rendSeries);

        this.overviewSubSurface.renderableSeries.add(...newSeries);
    }

    private removeSeriesFromOverview(renderableSeries: IRenderableSeries[], parentId: string): void {
        if (!this.overviewSubSurface) return;

        renderableSeries.forEach((series) => {
            // Find and remove the corresponding overview series
            const overviewSeries = this.overviewSubSurface.renderableSeries.getById(parentId + "_" + series.id);
            if (overviewSeries) {
                // Disconnect data before removing and deleting otherwise it would delete the shared dataSeries
                overviewSeries.dataSeries = undefined;
                this.overviewSubSurface.renderableSeries.remove(overviewSeries, true);
            }
        });
    }

    private setupRangeSelection(): void {
        // Add range selection modifier to control all subcharts
        this.rangeSelectionModifier = new OverviewRangeSelectionModifier();
        this.rangeSelectionModifier.xAxisId = this.overviewXAxis.id;
        this.rangeSelectionModifier.yAxisId = this.overviewYAxis.id;

        this.rangeSelectionModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
            this.allSubCharts.forEach((subChart) => {
                const subChartXAxis = subChart.xAxes.get(0);
                if (subChartXAxis && !selectedRange.equals(subChartXAxis.visibleRange)) {
                    subChartXAxis.setVisibleRangeWithLimits(selectedRange);
                }
            });
        };

        // Get the last subchart's X axis for synchronization
        if (this.allSubCharts.length > 0) {
            const lastSubChart = this.allSubCharts[this.allSubCharts.length - 1];
            const lastSubChartXAxis = lastSubChart.xAxes.get(0);

            if (lastSubChartXAxis) {
                // When last subchart zoom changes, update the overview selection
                lastSubChartXAxis.visibleRangeChanged.subscribe(({ visibleRange }: { visibleRange: NumberRange }) => {
                    const updatedSelectedRange = visibleRange.clip(this.overviewXAxis.visibleRange);
                    const shouldUpdateSelectedRange = !updatedSelectedRange.equals(
                        this.rangeSelectionModifier.selectedArea
                    );
                    if (shouldUpdateSelectedRange) {
                        this.rangeSelectionModifier.selectedArea = updatedSelectedRange;
                    }
                });

                this.overviewSubSurface.zoomExtents();
                this.rangeSelectionModifier.selectedArea = this.overviewXAxis.visibleRange;
            }
        }

        this.overviewSubSurface.chartModifiers.add(this.rangeSelectionModifier);

        this.overviewXAxis.visibleRangeChanged.subscribe(({ visibleRange: overviewVisibleRange }) => {
            const updatedSelectedRange = this.allSubCharts[0].xAxes.get(0).visibleRange.clip(overviewVisibleRange);
            this.rangeSelectionModifier.selectedArea = updatedSelectedRange;
        });
    }

    /**
     * Gets the overview subsurface for direct access if needed
     */
    public getOverviewSubSurface(): SciChartSubSurface {
        return this.overviewSubSurface;
    }

    /**
     * Gets the range selection modifier for customization if needed
     */
    public getRangeSelectionModifier(): OverviewRangeSelectionModifier {
        return this.rangeSelectionModifier;
    }
}
