import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { getChartsInitializationApi, IChartControls } from './drawExample';

@Component({
  selector: 'app-heatmap-interactions',
  template: `
  <style>
  .flex-outer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #4a148c;
  }

  .toolbar-row {
    display: flex;
    flex-basis: 70px;
    padding: 10px;
    width: 100%;
    color: #ffffff;
  }

  .chart-area {
    flex: 1;
  }
  </style>
  <div class="flex-outer-container">
    <div class="toolbar-row">
      <button mat-button [ngStyle]="{ 'color': ForegroundColor }" (click)="startAnimation()">
        Start
      </button>
      <button mat-button [ngStyle]="{ 'color': ForegroundColor }" (click)="stopAnimation()" >
        Stop
      </button>
      <button mat-button [ngStyle]="{ 'color': ForegroundColor }" (click)="loadBasicExample()" >
        Load basic example
      </button>
      <button mat-button [ngStyle]="{ 'color': ForegroundColor }" (click)="loadDoubleSlitExample()" >
        Load double slit example
      </button>
      <button mat-button [ngStyle]="{ 'color': ForegroundColor }" (click)="showHelp()" >
        Show Help
      </button>
    </div>
    <div style="display: flex; flex-direction: row; flex-basis: 500px;">
      <scichart-angular
        [initChart]="chartsInitializationAPI.initMainChart"
        (onInit)="onChartInit($event, 'main')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        #crossSectionChart
        [initChart]="chartsInitializationAPI.initCrossSectionChart"
        (onInit)="onChartInit($event, 'crossSection')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    </div>
    <div style="display: flex; flex-direction: row; flex-basis: 500px;">
      <scichart-angular
        #inputChart
        [initChart]="chartsInitializationAPI.inputChart"
        (onInit)="onChartInit($event, 'input')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
      <scichart-angular
        #historyChart
        [initChart]="chartsInitializationAPI.initHistoryChart"
        (onInit)="onChartInit($event, 'history')"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    </div>
  </div>
  `
})
export class HeatmapInteractionsComponent implements AfterViewInit {
  ForegroundColor = '#FFFFFF';
  DarkIndigo = '#4a148c'; 
  chartsInitializationAPI = getChartsInitializationApi();
  controlsRef: IChartControls | undefined;

  @ViewChild('mainChart', { static: false }) mainChart: ElementRef | undefined;
  @ViewChild('crossSectionChart', { static: false }) crossSectionChart: ElementRef | undefined;
  @ViewChild('inputChart', { static: false }) inputChart: ElementRef | undefined;
  @ViewChild('historyChart', { static: false }) historyChart: ElementRef | undefined;

  ngAfterViewInit(): void {
    console.log('View Initialized');
    console.log('Main Chart:', this.mainChart?.nativeElement);
    console.log('Cross Section Chart:', this.crossSectionChart?.nativeElement);
    console.log('Input Chart:', this.inputChart?.nativeElement);
    console.log('History Chart:', this.historyChart?.nativeElement);

    this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();

    if (this.mainChart && this.crossSectionChart && this.inputChart && this.historyChart) {
      try {
        this.chartsInitializationAPI.initMainChart(this.mainChart.nativeElement);
        this.chartsInitializationAPI.initCrossSectionChart(this.crossSectionChart.nativeElement);
        this.chartsInitializationAPI.inputChart(this.inputChart.nativeElement);
        this.chartsInitializationAPI.initHistoryChart(this.historyChart.nativeElement);
        this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
        this.startAnimation()
      } catch (error) {
        console.error('Error initializing charts:', error);
      }
    } else {
      console.error('One or more chart elements are not available');
    }
  }

  startAnimation(): void {
    if (this.controlsRef) {
      this.controlsRef.startAnimation();
    }
  }

  stopAnimation(): void {
    if (this.controlsRef) {
      this.controlsRef.stopAnimation();
    }
  }

  loadBasicExample(): void {
    if (this.controlsRef) {
      this.controlsRef.twoPoint();
    }
  }

  loadDoubleSlitExample(): void {
    if (this.controlsRef) {
      this.controlsRef.interference();
    }
  }

  showHelp(): void {
    if (this.controlsRef) {
      this.controlsRef.showHelp();
    }
  }

  onChartInit(ctx: any, chartType: string): void {
    if (ctx && typeof ctx.onChartInit === 'function') {
      ctx.onChartInit();
    } else {
      console.error('ctx.onChartInit is not a function or ctx is undefined');
    }
  }
}
