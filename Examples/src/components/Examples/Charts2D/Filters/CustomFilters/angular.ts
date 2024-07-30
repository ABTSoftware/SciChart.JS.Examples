import { Component, ElementRef, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { drawExample } from "./drawExample";

@Component({
    selector: 'app-custom-filter',
    template: `
<scichart-angular
      [initChart]="drawExample"
      (onInit)="onInit($event)"
      (onDelete)="onDelete($event)"
      style="flex: 1; flex-basis: 50%;">
</scichart-angular>
    `,
})
export class CustomFilters {

    private initResult: any;

    async onInit(initResult: any) {
      this.initResult = initResult;
      this.startDemo();
    }
  
    onDelete() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }
  
    startDemo() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.startDemo();
      }
    }
  
    stopDemo() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }
  
    ngOnInit() {
      // Initialization logic can go here
    }
  
    ngOnDestroy() {
      // Cleanup logic can go here
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }

 // <div #sciChartDiv style="width: 100%; height: 600px;"></div>
        // <button (click)="startDemo()">Start Demo</button>
        // <button (click)="stopDemo()">Stop Demo</button>
    drawExample = drawExample;
    // ngAfterViewInit(): void {
    //     throw new Error('Method not implemented.');
    // }
    // ngOnInit(): void {
    //     throw new Error('Method not implemented.');
    // }
    // @ViewChild('sciChartDiv', { static: true })
    // sciChartDiv!: ElementRef<HTMLDivElement>;

    // private sciChartSurface!: SciChartSurface;
    // private dataSeries!: XyDataSeries;
    // private gaussFilter!: XyCustomFilter;
    // private aggFilter!: AggregationFilter;
    // private timerId: NodeJS.Timeout | undefined;
    // private lastX = 0;

    // constructor() {}
    // ngOnInit(): void {
    //     throw new Error('Method not implemented.');
    // }

    // async ngAfterViewInit() {
    //     await this.initializeSciChart();
    //     this.startDemo();
    //   }

    // // ngOnInit() {
    // //     this.initializeSciChart();
    // // }
    // async initializeSciChart() {
    //     const { sciChartSurface, wasmContext } = await SciChartSurface.create(this.sciChartDiv.nativeElement, {
    //         theme: appTheme.SciChartJsTheme,
    //     });

    //     this.sciChartSurface = sciChartSurface;
    //     this.dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: 'Original Data' });

    //     const rawXAxis = new NumericAxis(wasmContext, { id: 'rawX', isVisible: false, autoRange: EAutoRange.Always });
    //     const aggXAxis = new NumericAxis(wasmContext, {
    //         id: 'aggX',
    //         axisTitle: 'Value',
    //         autoRange: EAutoRange.Always,
    //         labelPrecision: 0,
    //     });
    //     this.sciChartSurface.xAxes.add(rawXAxis, aggXAxis);

    //     const rawYAxis = new NumericAxis(wasmContext, {
    //         autoRange: EAutoRange.Always,
    //         axisTitle: 'Raw Data',
    //         id: 'rawY',
    //         labelPrecision: 0,
    //         labelStyle: { alignment: ELabelAlignment.Right },
    //     });
    //     const aggYAxis = new NumericAxis(wasmContext, {
    //         axisTitle: 'Frequency (Aggregated)',
    //         id: 'aggY',
    //         autoRange: EAutoRange.Always,
    //         axisAlignment: EAxisAlignment.Left,
    //         growBy: new NumberRange(0, 0.5),
    //         labelPrecision: 0,
    //     });
    //     this.sciChartSurface.yAxes.add(aggYAxis, rawYAxis);

    //     this.gaussFilter = new XyCustomFilter(this.dataSeries, { dataSeriesName: 'Custom Filter: Original x Gaussian Random' });
    //     this.gaussFilter.filterFunction = (i, y) => y * this.gaussianRand();

    //     this.sciChartSurface.renderableSeries.add(
    //         new XyScatterRenderableSeries(wasmContext, {
    //             pointMarker: new EllipsePointMarker(wasmContext, {
    //                 width: 3,
    //                 height: 3,
    //                 strokeThickness: 0,
    //                 fill: 'orange',
    //                 opacity: 0.77,
    //             }),
    //             stroke: 'orange',
    //             dataSeries: this.gaussFilter,
    //             xAxisId: 'rawX',
    //             yAxisId: 'rawY',
    //         })
    //     );

    //     this.sciChartSurface.renderableSeries.add(
    //         new FastLineRenderableSeries(wasmContext, {
    //             dataSeries: this.dataSeries,
    //             stroke: 'teal',
    //             strokeThickness: 3,
    //             xAxisId: 'rawX',
    //             yAxisId: 'rawY',
    //         })
    //     );

    //     // Example of initializing AggregationFilter
    //     this.aggFilter = new AggregationFilter(this.gaussFilter, 5, 'Custom Filter: Aggregation');
    //     this.sciChartSurface.renderableSeries.add(
    //         new FastColumnRenderableSeries(wasmContext, {
    //             fill: 'rgba(135, 206, 235, 0.5)',
    //             stroke: 'rgb(135, 206, 235)',
    //             dataSeries: this.aggFilter,
    //             xAxisId: 'aggX',
    //             yAxisId: 'aggY',
    //             cornerRadius: 10,
    //         })
    //     );

    //     this.sciChartSurface.chartModifiers.add(new LegendModifier());
    // }

    // startDemo() {
    //     this.stopDemo(); // Ensure any previous timer is stopped

    //     const updateFunc = () => {
    //         if (this.dataSeries.count() >= 100_000) {
    //             this.stopDemo();
    //             return;
    //         }

    //         const { xValues, yValues } = this.getData(500);
    //         this.dataSeries.appendRange(xValues, yValues);

    //         this.timerId = setTimeout(updateFunc, 10);
    //     };

    //     this.timerId = setTimeout(updateFunc, 10);
    // }

    // stopDemo() {
    //     if (this.timerId) {
    //         clearTimeout(this.timerId);
    //     }
    //     this.timerId = undefined;
    //     this.lastX = 0;
    // }

    // gaussianRand() {
    //     let rand = 0;
    //     for (let i = 0; i < 6; i += 1) {
    //         rand += Math.random() + 0.5;
    //     }
    //     return rand / 6;
    // }

    // getData(n: number) {
    //     const xValues: number[] = [];
    //     const yValues: number[] = [];
    //     for (let i = 0; i < n; i++) {
    //         xValues.push(this.lastX);
    //         yValues.push(50 + this.lastX / 1000);
    //         this.lastX++;
    //     }
    //     return { xValues, yValues };
    // }
}

