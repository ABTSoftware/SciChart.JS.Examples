import { Component } from '@angular/core';
import { appTheme } from '../../../theme';
import { getChartsInitializationApi, IChartControls } from './drawExample';

@Component({
  selector: 'app-heatmap-interactions',
  template: `
    <div class="chart-wrapper">
      <div [ngStyle]="localStyles.flexOuterContainer">
        <div [ngStyle]="localStyles.toolbarRow">
          <button mat-button (click)="startAnimation()" [ngStyle]="{ color: appTheme.ForegroundColor }" [disabled]="!controlsRef">Start</button>
          <button mat-button (click)="stopAnimation()" [ngStyle]="{ color: appTheme.ForegroundColor }" [disabled]="!controlsRef">Stop</button>
          <button mat-button (click)="loadBasicExample()" [ngStyle]="{ color: appTheme.ForegroundColor }" [disabled]="!controlsRef">Load basic example</button>
          <button mat-button (click)="loadDoubleSlitExample()" [ngStyle]="{ color: appTheme.ForegroundColor }" [disabled]="!controlsRef">Load double slit example</button>
          <button mat-button (click)="showHelp()" [ngStyle]="{ color: appTheme.ForegroundColor }" [disabled]="!controlsRef">Show Help</button>
        </div>
        <div style="display: flex; flex-direction: row;">
          <scichart-angular  [initChart]="chartsInitializationAPI.initMainChart"
               (onInit)="onChartInit($event)"
            style="flex: 1; flex-basis: 50%;"></scichart-angular>
          <scichart-angular  [initChart]="chartsInitializationAPI.initCrossSectionChart"
            style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"></scichart-angular>
        </div>
        <div style="display: flex; flex-direction: row;">
          <scichart-angular  [initChart]="chartsInitializationAPI.inputChart"
            style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"></scichart-angular>
          <scichart-angular  [initChart]="chartsInitializationAPI.initHistoryChart"
            style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"></scichart-angular>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      height: 100%;
      width: 100%;
    }
  `]
})

export class HeatmapInteractionsComponent {
  localStyles = {
    flexOuterContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appTheme.DarkIndigo,
    },
    toolbarRow: {
      display: 'flex',
      flexBasis: '70px',
      padding: 10,
      width: '100%',
      color: appTheme.ForegroundColor,
    },
  };

  chartsInitializationAPI = getChartsInitializationApi();
  controlsRef?: IChartControls;
  appTheme = appTheme;
 
  onChartInit(){
    setTimeout(()=>{
        this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
      },1000)
  
}
  startAnimation(): void {
    this.controlsRef?.startAnimation();
  }

  stopAnimation(): void {
    this.controlsRef?.stopAnimation();
  }

  loadBasicExample(): void {
    this.controlsRef?.twoPoint();
  }

  loadDoubleSlitExample(): void {
    this.controlsRef?.interference();
  }

  showHelp(): void {
    this.controlsRef?.showHelp();
  }
}