import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-stack-chart",
    template: `
    <style>
            
        .toolbarRow {
            display: flex;
            flex-basis: 70px;
            padding: 10px;
            width: 100%;
            /* Additional toolbar row styles */
        }

        .chartArea {
            flex: 1;
            /* Additional chart area styles */
        }

        .btn-outer{
            padding: 0.5rem;
            background-color: #141b39;
            color: #ffffff;
        }
        ::ng-deep .mat-button-toggle-button{
            padding: 1rem !important;
            background-color: transparent;
        }
        ::ng-deep .mat-button-toggle-button:focus-visible{
            background-color: transparent !important;
        }
        ::ng-deep .mat-pseudo-checkbox{
            display: none !important;
        }
    </style>
     <div class="flex-outer-container btn-outer">
        <mat-button-toggle-group [(ngModel)]="use100PercentStackedMode" class="toolbar-row" size="small" (ngModelChange)="togglePercentageMode($event)">
          <mat-button-toggle [value]="false" color="primary">Stacked mode</mat-button-toggle>
          <mat-button-toggle [value]="true" color="primary">100% Stacked mode</mat-button-toggle>
        </mat-button-toggle-group>
    </div>
    <div id="chart"></div>`,
})
export class StackeAppComponent  {
    title = "scichart-angular-app";

    drawExample = drawExample;

    ngAfterViewInit(): void {
          this.initializeChart();
    }
      

  private sciChartSurface:any;
  private stackedColumnCollection: any;
  private use100PercentStackedMode = false;
  
  
  private async initializeChart(): Promise<void> {
      const { sciChartSurface, stackedColumnCollection } = await this.drawExample();
      this.sciChartSurface = sciChartSurface;
      this.stackedColumnCollection = stackedColumnCollection;
  
  }
  ngOnDestroy(){
    this.disposeChart()
  }

  private disposeChart(): void {
    if (this.sciChartSurface) {
      this.sciChartSurface.delete();
    }
  }

  togglePercentageMode(value: boolean): void { 
      this.use100PercentStackedMode = value;
      this.stackedColumnCollection.isOneHundredPercent = value;
      this.sciChartSurface.zoomExtents(200);
  }

}
