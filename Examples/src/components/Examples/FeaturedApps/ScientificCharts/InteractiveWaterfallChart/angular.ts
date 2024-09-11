import { Component, OnInit, AfterViewInit } from '@angular/core';
import { getChartsInitializationAPI } from './drawExample';


@Component({
  selector: 'app-interactive-waterfall-chart',
  template: `
  <style>
.chart-wrapper {
  width: 100%;
  height: 100%;
  background: #2d2d2d;
}
  </style>
  <div style="background: #2d2d2d;" class="chart-wrapper">
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #1e1e1e;">
    <scichart-angular
      [initChart]="chartsInitializationAPI.initMainChart"
      (onInit)="onInit()"
      style="flex: 1; flex-basis: 50%;">
    </scichart-angular>
    <div style="display: flex; flex: 1; flex-basis: 50%;">
      <scichart-angular
        [initChart]="chartsInitializationAPI.initCrossSectionLeft"
        style="flex: 1;">
      </scichart-angular>
      <scichart-angular
        [initChart]="chartsInitializationAPI.initCrossSectionRight"
        style="flex: 1;">
      </scichart-angular>
    </div>
  </div>
</div>
`,
})
export class InteractiveWaterfallChartComponent  {
    chartsInitializationAPI = getChartsInitializationAPI();
 
    async onInit() {
      this.chartsInitializationAPI.configureAfterInit();
      this.chartsInitializationAPI.initMainChart
    }

}
