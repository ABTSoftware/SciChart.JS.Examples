import { Component, OnDestroy } from '@angular/core';
import { SciChartSurface } from 'scichart';
import { getChartsInitializationAPI } from './drawExample';

@Component({
  selector: 'app-multi-pane-stock-charts',
  template: `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <scichart-angular
        [initChart]="chartsInitializationAPI.drawPriceChart"
        (onInit)="onChartInit($event, 'price')"
        (onDelete)="onDelete($event)"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        [initChart]="chartsInitializationAPI.drawMacdChart"
        (onInit)="onChartInit($event, 'macd')"
        (onDelete)="onDelete($event)"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        [initChart]="chartsInitializationAPI.drawRsiChart"
        (onInit)="onChartInit($event, 'rsi')"
        (onDelete)="onDelete($event)"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular *ngIf="showOverviewChart"
        [initChart]="getOverviewChartInit()"
        (onInit)="onChartInit($event, 'overview')"
        (onDelete)="onDelete($event)"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    </div>
  `
})
export class MultiPaneStockChartsComponent {
  private chartsInitializationAPI = getChartsInitializationAPI();
  mainChart?: SciChartSurface;
  macdChart?: SciChartSurface;
  rsiChart?: SciChartSurface;
  overviewChart?: SciChartSurface;
  showOverviewChart = false; 

  async onChartInit(event: any, chartType: 'price' | 'macd' | 'rsi' | 'overview') {
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
        case 'overview':
          this.overviewChart = event.sciChartSurface;
          break;
      }

      if (this.mainChart && this.macdChart && this.rsiChart) {
        this.showOverviewChart = true; 
        this.configureCharts();
      }
    } else {
      console.error("Chart not initialized!");
    }
  }

  private getOverviewChartInit() {
    return this.mainChart ? this.chartsInitializationAPI.drawOverview(this.mainChart) : null;
  }

  private configureCharts() {
    if (this.mainChart && this.macdChart && this.rsiChart) {
      this.chartsInitializationAPI.configureAfterInit();
    }
  }

  onDelete(event: any) {
    const chartSurface = event.sciChartSurface;
    if (chartSurface) {
      try {
        chartSurface.delete();
      } catch (error) {
        console.error("Error deleting chart surface:", error);
      }
    } else {
      console.warn("Chart surface is already deleted or not available.");
    }
  }
}
