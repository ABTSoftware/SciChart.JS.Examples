import { Component } from '@angular/core';
import { drawExample, drawHeatmapLegend } from './drawExample'; 

@Component({
  selector: 'app-li-dar3d-point-cloud',
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
    [initChart]="initSciChartSurface"
    class="chart-example">
  </scichart-angular>
  <scichart-angular
    [initChart]="initHeatmapLegend"
    class="chart-legend">
  </scichart-angular>
</div>
`,
 
})

export class LiDAR3DPointCloudDemoComponent  {
  initSciChartSurface = drawExample;
  initHeatmapLegend = drawHeatmapLegend;
}
