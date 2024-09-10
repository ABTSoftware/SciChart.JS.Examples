import { Component } from '@angular/core';
import { drawExample, drawHeatmapLegend } from "./drawExample";
@Component({
  selector: 'app-point-line-3d-chart',
  template: `
  <style>
  .chart-area {
  position: relative;
  width: 100%;
  height: 100%;
}
.chart-example {
  position: absolute;
  height: 100%;
  width: calc(100% - 140px);
  top: 0;
  left: 0;
}
.chart-legend {
  position: absolute;
  height: 95%;
  width: 110px;
  right: 20px;
  margin: 20px;
}
  </style>
  <div class="chart-area">
  <scichart-angular
    [initChart]="drawExample"
    (onInit)="onInit($event)"
    (onDelete)="onDelete($event)"
    class="chart-example">
  </scichart-angular>
  <scichart-angular
    [initChart]="drawHeatmapLegend"
    class="chart-legend">
  </scichart-angular>
</div>
`,
})
export class PointLine3DChartComponent {

  drawExample = drawExample;
  drawHeatmapLegend = drawHeatmapLegend

}
