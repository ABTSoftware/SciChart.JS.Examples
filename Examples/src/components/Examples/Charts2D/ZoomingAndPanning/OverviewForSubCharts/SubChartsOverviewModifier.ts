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
} from "scichart";

export interface ISubChartsOverviewModifierOptions extends IChartModifierBaseOptions {
    /** Position of the overview subsurface (default: bottom 20% of the chart) */
    overviewPosition?: Rect;
    /** Whether the overview subsurface should be transparent */
    isTransparent?: boolean;
    /** Colors array for the overview series */
    colors?: string[];
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
    /** Stroke thickness for overview series */
    strokeThickness?: number;
    /** Opacity for overview series */
    opacity?: number;
    /**
     * Whether to automatically adjust subchart positions when overview is attached/detached
     * If true, subcharts will be resized to make room for overview
     * If false, overview will overlap with existing content
     */
    adjustSubChartPositions?: boolean;
    /**
     * The height ratio of the overview (0-1, default: 0.2 = 20%)
     * Only used when adjustSubChartPositions is true
     */
    overviewHeightRatio?: number;
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
    private allDataSeries: XyDataSeries[] = [];
    private seriesColorMap: Map<XyDataSeries, string> = new Map();

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
            strokeThickness: 2,
            opacity: 0.8,
            adjustSubChartPositions: false,
            overviewHeightRatio: 0.2,
            ...options,
        };
    }

    public override onAttach(): void {
        super.onAttach();

        // Use a longer delay to ensure all subcharts are fully initialized
        setTimeout(() => {
            this.initializeOverview();
        }, 300);
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
            this.addSubChartSeriesToOverview(subChart);
        }

        // Subscribe to series collection changes on this subchart
        subChart.renderableSeries.collectionChanged.subscribe((args) => {
            if (this.overviewSubSurface) {
                // Handle new series

                if (args.getNewItems()) {
                    args.getNewItems().forEach((series: IRenderableSeries) => {
                        if (series.dataSeries instanceof XyDataSeries) {
                            this.addSeriesToOverview([series.dataSeries]);
                        }
                    });

                    // Handle removed series
                    args.getOldItems().forEach((series: IRenderableSeries) => {
                        if (series.dataSeries instanceof XyDataSeries) {
                            this.removeSeriesFromOverview([series.dataSeries]);
                        }
                    });
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
                const seriesToRemove: XyDataSeries[] = [];
                subChart.renderableSeries.asArray().forEach((series) => {
                    if (series.dataSeries instanceof XyDataSeries) {
                        seriesToRemove.push(series.dataSeries);
                    }
                });
                this.removeSeriesFromOverview(seriesToRemove);
            }
        }
    }

    public override onAttachSeries(series: IRenderableSeries): void {
        // Handle series attached to main surface
        if (series.dataSeries instanceof XyDataSeries && this.overviewSubSurface) {
            this.addSeriesToOverview([series.dataSeries]);
        }
    }

    public override onDetachSeries(series: IRenderableSeries): void {
        // Handle series detached from main surface
        if (series.dataSeries instanceof XyDataSeries && this.overviewSubSurface) {
            this.removeSeriesFromOverview([series.dataSeries]);
        }
    }

    private initializeOverview(): void {
        this.createOverviewSubSurface();
        this.collectExistingData();
        this.addAllSeriesToOverview();
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

    private collectExistingData(): void {
        // Collect all existing subcharts and their data
        this.parentSurface.subCharts.forEach((subChart: ISciChartSubSurface) => {
            if (subChart.id !== "overviewSubSurface") {
                // Add to our tracking if not already added
                if (!this.allSubCharts.includes(subChart)) {
                    this.allSubCharts.push(subChart);
                }

                // Collect all data series from this subchart
                subChart.renderableSeries.asArray().forEach((series) => {
                    if (series.dataSeries instanceof XyDataSeries && !this.allDataSeries.includes(series.dataSeries)) {
                        this.allDataSeries.push(series.dataSeries);
                    }
                });
            }
        });
    }

    private addAllSeriesToOverview(): void {
        if (this.allDataSeries.length > 0) {
            // Create overview series for all collected data series
            this.createOverviewSeries(this.allDataSeries);
        }
    }

    private addSubChartSeriesToOverview(subChart: ISciChartSubSurface): void {
        const seriesToAdd: XyDataSeries[] = [];
        subChart.renderableSeries.asArray().forEach((series) => {
            if (series.dataSeries instanceof XyDataSeries && !this.allDataSeries.includes(series.dataSeries)) {
                seriesToAdd.push(series.dataSeries);
            }
        });

        if (seriesToAdd.length > 0) {
            this.addSeriesToOverview(seriesToAdd);
        }
    }

    private addSeriesToOverview(dataSeries: XyDataSeries[]): void {
        // Add new series to tracking and create overview series
        const newSeries = dataSeries.filter((series) => !this.allDataSeries.includes(series));
        if (newSeries.length > 0) {
            this.allDataSeries.push(...newSeries);
            this.createOverviewSeries(newSeries);
        }
    }

    private createOverviewSeries(dataSeries: XyDataSeries[]): void {
        if (!this.overviewSubSurface) return;

        const wasmContext = this.parentSurface.webAssemblyContext2D;
        const colors = this.options.colors || ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];

        dataSeries.forEach((series) => {
            const colorIndex = this.overviewSubSurface.renderableSeries.asArray().length % colors.length;
            const color = colors[colorIndex] || "#ffffff";

            // Store color mapping
            this.seriesColorMap.set(series, color);

            const overviewSeries = new FastLineRenderableSeries(wasmContext, {
                dataSeries: series,
                strokeThickness: this.options.strokeThickness,
                opacity: this.options.opacity,
                stroke: color,
            });

            this.overviewSubSurface.renderableSeries.add(overviewSeries);
        });
    }

    private removeSeriesFromOverview(dataSeries: XyDataSeries[]): void {
        if (!this.overviewSubSurface) return;

        dataSeries.forEach((series) => {
            const index = this.allDataSeries.indexOf(series);
            if (index > -1) {
                this.allDataSeries.splice(index, 1);
                this.seriesColorMap.delete(series);

                // Find and remove the corresponding overview series
                const overviewSeries = this.overviewSubSurface.renderableSeries
                    .asArray()
                    .find((os) => os.dataSeries === series);
                if (overviewSeries) {
                    this.overviewSubSurface.renderableSeries.remove(overviewSeries, true);
                }
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

                // Set initial selection to use the full range (0-99) instead of limited range
                // Create a NumberRange with the known data range
                const fullDataRange = new NumberRange(0, 99);
                this.rangeSelectionModifier.selectedArea = fullDataRange;
            }
        }

        this.overviewSubSurface.chartModifiers.add(this.rangeSelectionModifier);

        // Additional fix: Subscribe to overview axis visible range changes to ensure full selection
        this.overviewXAxis.visibleRangeChanged.subscribe(() => {
            // Set selection to full range after axis range is established
            setTimeout(() => {
                const fullRange = this.overviewXAxis.visibleRange;
                if (fullRange && fullRange.max > 50) {
                    // Only update if we have a reasonable range
                    this.rangeSelectionModifier.selectedArea = fullRange;
                }
            }, 100);
        });
    }

    /**
     * Updates the colors used for the overview series
     */
    public updateColors(colors: string[]): void {
        this.options.colors = colors;

        // Update existing series colors
        if (this.overviewSubSurface) {
            this.overviewSubSurface.renderableSeries.asArray().forEach((series, index) => {
                const colorIndex = index % colors.length;
                series.stroke = colors[colorIndex];

                // Update color mapping
                if (series.dataSeries instanceof XyDataSeries) {
                    this.seriesColorMap.set(series.dataSeries, colors[colorIndex]);
                }
            });
        }
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
