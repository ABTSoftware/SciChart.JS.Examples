import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-realTimeMountain-chart",
    template: `<scichart-angular
    [initChart]="drawExample"
    (onInit)="onInitHandler($event)"
    (onDelete)="onDeleteHandler($event)"
></scichart-angular>`,
})
export class AppRealTimeMountainComponent {
    title = "scichart-angular-app";

    private sciChartSurface:any;
    
    drawExample = drawExample;
    
    onInitHandler = (initResult: any) => {
        initResult.controls.handleStart();
    };
  
    onDeleteHandler = (initResult: any) => {
        initResult.controls.handleStop();
    };

    ngOnDestroy(){
        this.disposeChart()
      }
    
      private disposeChart(): void {
        if (this.sciChartSurface) {
          this.sciChartSurface.delete();
        }
      }
}
