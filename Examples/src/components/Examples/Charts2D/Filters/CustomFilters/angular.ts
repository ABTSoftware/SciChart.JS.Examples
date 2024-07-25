import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    BaseDataSeries,
    NumericAxis,
    EAutoRange,
    EAxisAlignment,
    ELabelAlignment,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    EllipsePointMarker,
    LegendModifier,
    NumberRange,
    SciChartSurface,
    XyCustomFilter,
    XyDataSeries,
    XyScatterRenderableSeries,
    XyFilterBase,
} from 'scichart';
import { appTheme } from '../../../theme';

// Define AggregationFilter class
class AggregationFilter extends XyFilterBase {
    private bins: Map<number, number> = new Map<number, number>();
    private binWidthProperty = 1;

    constructor(originalSeries: BaseDataSeries, binWidth: number, dataSeriesName: string) {
        super(originalSeries, { dataSeriesName });
        this.binWidthProperty = binWidth;
        this.filterAll();
    }

    public get binWidth() {
        return this.binWidthProperty;
    }

    public set binWidth(value: number) {
        this.binWidthProperty = value;
        this.filterAll();
    }

    protected filterAll() {
        this.clear();
        this.bins.clear();
        this.filter(0, this.getOriginalCount());
    }

    override filterOnAppend(count: number): void {
        // Overriding this so we do not have to reprocess the entire series on append
        this.filter(this.getOriginalCount() - count, count);
    }

    protected filter(start: number, count: number): void {
        const numUtil = this.originalSeries.webAssemblyContext.NumberUtil;
        for (let i = start; i < start + count; i++) {
            const bin = numUtil.RoundDown(this.getOriginalYValues().get(i), this.binWidth);
            if (bin !== undefined && this.bins) {
                const currentValue = this.bins.get(bin);
                if (currentValue !== undefined) {
                    const newVal = currentValue + 1;
                    this.bins.set(bin, newVal);
                } else {
                    this.bins.set(bin, 1);
                }
            }
        }
        if (this.bins) {
            const keys = Array.from(this.bins.keys()).sort((a, b) => a - b);
            this.clear();
            const yValues: number[] = [];
            for (const key of keys) {
                const value = this.bins.get(key);
                if (value !== undefined) {
                    yValues.push(value);
                }
            }
            this.appendRange(keys, yValues);
        }
    }

    override onClear() {
        this.clear();
        this.bins.clear();
    }
}

@Component({
    selector: 'app-custom-filter',
    template: `
        <div #sciChartDiv style="width: 100%; height: 600px;"></div>
        <button (click)="startDemo()">Start Demo</button>
        <button (click)="stopDemo()">Stop Demo</button>
    `,
})
export class CustomFilters implements OnInit {
    @ViewChild('sciChartDiv', { static: true })
    sciChartDiv!: ElementRef<HTMLDivElement>;

    private sciChartSurface!: SciChartSurface;
    private dataSeries!: XyDataSeries;
    private gaussFilter!: XyCustomFilter;
    private aggFilter!: AggregationFilter;
    private timerId: NodeJS.Timeout | undefined;
    private lastX = 0;

    constructor() {}

    ngOnInit() {
        this.initializeSciChart();
        this.startDemo();
    }
    async initializeSciChart() {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(this.sciChartDiv.nativeElement, {
            theme: appTheme.SciChartJsTheme,
        });

        this.sciChartSurface = sciChartSurface;
        this.dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: 'Original Data' });

        const rawXAxis = new NumericAxis(wasmContext, { id: 'rawX', isVisible: false, autoRange: EAutoRange.Always });
        const aggXAxis = new NumericAxis(wasmContext, {
            id: 'aggX',
            axisTitle: 'Value',
            autoRange: EAutoRange.Always,
            labelPrecision: 0,
        });
        this.sciChartSurface.xAxes.add(rawXAxis, aggXAxis);

        const rawYAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            axisTitle: 'Raw Data',
            id: 'rawY',
            labelPrecision: 0,
            labelStyle: { alignment: ELabelAlignment.Right },
        });
        const aggYAxis = new NumericAxis(wasmContext, {
            axisTitle: 'Frequency (Aggregated)',
            id: 'aggY',
            autoRange: EAutoRange.Always,
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0, 0.5),
            labelPrecision: 0,
        });
        this.sciChartSurface.yAxes.add(aggYAxis, rawYAxis);

        this.gaussFilter = new XyCustomFilter(this.dataSeries, { dataSeriesName: 'Custom Filter: Original x Gaussian Random' });
        this.gaussFilter.filterFunction = (i, y) => y * this.gaussianRand();

        this.sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 3,
                    height: 3,
                    strokeThickness: 0,
                    fill: 'orange',
                    opacity: 0.77,
                }),
                stroke: 'orange',
                dataSeries: this.gaussFilter,
                xAxisId: 'rawX',
                yAxisId: 'rawY',
            })
        );

        this.sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: this.dataSeries,
                stroke: 'teal',
                strokeThickness: 3,
                xAxisId: 'rawX',
                yAxisId: 'rawY',
            })
        );

        // Example of initializing AggregationFilter
        this.aggFilter = new AggregationFilter(this.gaussFilter, 5, 'Custom Filter: Aggregation');
        this.sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(wasmContext, {
                fill: 'rgba(135, 206, 235, 0.5)',
                stroke: 'rgb(135, 206, 235)',
                dataSeries: this.aggFilter,
                xAxisId: 'aggX',
                yAxisId: 'aggY',
                cornerRadius: 10,
            })
        );

        this.sciChartSurface.chartModifiers.add(new LegendModifier());
    }

    startDemo() {
        this.stopDemo(); // Ensure any previous timer is stopped

        const updateFunc = () => {
            if (this.dataSeries.count() >= 100_000) {
                this.stopDemo();
                return;
            }

            const { xValues, yValues } = this.getData(500);
            this.dataSeries.appendRange(xValues, yValues);

            this.timerId = setTimeout(updateFunc, 10);
        };

        this.timerId = setTimeout(updateFunc, 10);
    }

    stopDemo() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = undefined;
        this.lastX = 0;
    }

    gaussianRand() {
        let rand = 0;
        for (let i = 0; i < 6; i += 1) {
            rand += Math.random() + 0.5;
        }
        return rand / 6;
    }

    getData(n: number) {
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let i = 0; i < n; i++) {
            xValues.push(this.lastX);
            yValues.push(50 + this.lastX / 1000);
            this.lastX++;
        }
        return { xValues, yValues };
    }
}

