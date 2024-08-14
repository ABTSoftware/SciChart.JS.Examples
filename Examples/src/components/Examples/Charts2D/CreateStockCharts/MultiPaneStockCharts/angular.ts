import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SciChartSurface } from 'scichart';
import { getChartsInitializationAPI } from './drawExample'; 

@Component({
  selector: 'app-multi-pane-stock-charts',
  template: `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <scichart-angular
        #priceChart
        [initChart]="drawPriceChart"
        (onInit)="onChartInit($event, 'price')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        #macdChart
        [initChart]="drawMacdChart"
        (onInit)="onChartInit($event, 'macd')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        #rsiChart
        [initChart]="drawRsiChart"
        (onInit)="onChartInit($event, 'rsi')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        #overviewChart
        *ngIf="mainChartInitialized && macdChart && rsiChart"
        [initChart]="drawOverviewChart"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    </div>
  `
})
export class MultiPaneStockChartsComponent  {
  @ViewChild('priceChart', { static: false }) priceChartRef!: ElementRef;
  @ViewChild('macdChart', { static: false }) macdChartRef!: ElementRef;
  @ViewChild('rsiChart', { static: false }) rsiChartRef!: ElementRef;
  @ViewChild('overviewChart', { static: false }) overviewChartRef!: ElementRef;

  private chartsInitializationAPI = getChartsInitializationAPI();

  mainChart?: SciChartSurface;
  macdChart?: SciChartSurface;
  rsiChart?: SciChartSurface;
  mainChartInitialized = false;

  drawPriceChart = this.chartsInitializationAPI.drawPriceChart;
  drawMacdChart = this.chartsInitializationAPI.drawMacdChart;
  drawRsiChart = this.chartsInitializationAPI.drawRsiChart;

  drawOverviewChart = async (rootElement: HTMLElement) => {
    if (this.mainChart && rootElement) {
      try {
        const divElement = rootElement as HTMLDivElement;
        const overviewFunc = this.chartsInitializationAPI.drawOverview(this.mainChart);
        
        if (typeof overviewFunc === 'function') {
          const result = await overviewFunc(divElement);
        }
      } catch (error) {
         console.log("error",error);
      }
    } 
  }

  async onChartInit(event: any, chartType: 'price' | 'macd' | 'rsi') {
    if (event?.sciChartSurface) {
      if (chartType === 'price') {
        this.mainChart = event.sciChartSurface;
        this.mainChartInitialized = true;
        if (this.mainChartInitialized && this.macdChart && this.rsiChart && this.priceChartRef?.nativeElement) {
          this.drawOverviewChart(this.priceChartRef.nativeElement);
        }
      } else if (chartType === 'macd') {
        this.macdChart = event.sciChartSurface;
      } else if (chartType === 'rsi') {
        this.rsiChart = event.sciChartSurface;
      }
      if (this.mainChart && this.macdChart && this.rsiChart) {
        this.configureCharts();
      }
    } else {
      console.log("All Chart not Init !")
    }
  }

  configureCharts() {
    if (this.mainChart && this.macdChart && this.rsiChart) {
      this.chartsInitializationAPI.configureAfterInit();
    }
  }

}
