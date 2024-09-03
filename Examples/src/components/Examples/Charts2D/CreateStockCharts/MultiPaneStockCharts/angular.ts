import { Component,AfterViewInit } from '@angular/core';
import { SciChartSurface } from 'scichart';
import { getChartsInitializationAPI } from './drawExample'; 

@Component({
  selector: 'app-multi-pane-stock-charts',
  template: `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <scichart-angular
        id="priceChart"
        [initChart]="chartsInitializationAPI.drawPriceChart"
        (onInit)="onChartInit($event, 'price')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        id="macdChart"
        [initChart]="chartsInitializationAPI.drawMacdChart"
        (onInit)="onChartInit($event, 'macd')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        id="rsiChart"
        [initChart]="chartsInitializationAPI.drawRsiChart"
        (onInit)="onChartInit($event, 'rsi')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular *ngIf="mainChart"
        id="rsiChart"
        [initChart]="chartsInitializationAPI.drawOverview(this.mainChart)"
        (onInit)="onChartInit($event, 'rsi')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    </div>
  `
})
//drawOverview
export class MultiPaneStockChartsComponent implements AfterViewInit {
  private chartsInitializationAPI = getChartsInitializationAPI();
  mainChart?: SciChartSurface;
  macdChart?: SciChartSurface;
  rsiChart?: SciChartSurface;

  ngAfterViewInit() {
    this.configureCharts();
  }

  async onChartInit(event: any, chartType: 'price' | 'macd' | 'rsi') {
    if (event?.sciChartSurface) {
      switch (chartType) {
        case 'price':
          this.mainChart = event.sciChartSurface;
          break;
        case 'macd':
          this.macdChart = event.sciChartSurface;
          break;
        case 'rsi':
          this.rsiChart = event.sciChartSurface;
          break;
      }

      if (this.mainChart && this.macdChart && this.rsiChart) {
        this.configureCharts();
      }
    } else {
      console.log("Chart not initialized!");
    }
  }

  private configureCharts() {
    if (this.mainChart && this.macdChart && this.rsiChart) {
      this.chartsInitializationAPI.configureAfterInit();
    }
  }
}
