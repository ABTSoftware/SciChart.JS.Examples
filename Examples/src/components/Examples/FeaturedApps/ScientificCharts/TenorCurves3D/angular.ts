import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExaple";
import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
// import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-Tenor-curves",
    template: `
    <style>
    
.ChartWrapper {
    overflow: hidden;
    position: relative;
    touch-action: none;
    aspect-ratio: 1.3333;
    img {
        display: block;
    }
   }
    </style>
    <div class="ChartWrapper">
  <div style="float: left; width: 50%; height: 100%; position: relative;">
    <!-- SciChartReact for 3D chart -->
    <div style="width: 100%; height: 100%;">
      <!-- Assuming SciChartReact is a custom Angular component -->
      
     <scichart-angular  [initChart]="draw3DChart" style="width: 100%; height: 100%;"></scichart-angular >
    </div>
    
    <!-- SciChartReact for Heatmap Legend -->
    <div style="position: absolute; top: 0; height: 95%; width: 100px; right: 0; margin: 20px;">
      <!-- Assuming SciChartReact is a custom Angular component -->
      <scichart-angular  [initChart]="drawHeatmapLegend" style="width: 100%; height: 100%;"></scichart-angular >
    </div>
  </div>
  
  <div style="position: relative; left: 50%; width: 50%; height: 100%;">
    <!-- SciChartReact for Line Chart 1 -->
    <div style="position: relative; height: 50%;">
      <!-- Assuming SciChartReact is a custom Angular component -->
      <scichart-angular  [initChart]="drawLineChart1" style="width: 100%; height: 100%;"></scichart-angular >
      
    </div>
    
    <!-- SciChartReact for Line Chart 2 -->
    <div style="position: relative; height: 50%;">
      <!-- Assuming SciChartReact is a custom Angular component -->
      <scichart-angular  [initChart]="drawLineChart2" style=" height: 50%;"></scichart-angular >
    </div>
  </div>
</div>
`,
})
export class TenorCurves3D {
    title = "scichart-angular-app";

    draw3DChart = draw3DChart;
    drawLineChart1 = drawLineChart1;
    drawLineChart2=drawLineChart2;
    drawHeatmapLegend=drawHeatmapLegend;

}
