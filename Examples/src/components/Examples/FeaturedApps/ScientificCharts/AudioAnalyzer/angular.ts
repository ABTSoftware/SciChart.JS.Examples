import { Component, OnInit, OnDestroy, ElementRef, ViewChild,AfterViewInit } from '@angular/core';
import { getChartsInitializationApi } from './drawExample';
import { appTheme } from '../../../theme';

@Component({
  selector: 'app-audio-analyzer',
  template: `
  <style>
  .chart-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fft-spectrogram-container {
  display: flex;
  flex: 1;
}
  </style>
  <div [ngStyle]="{'background': appTheme.Background}" class="chart-wrapper">
  <div class="chart-container">
    <div #audioChart style="width: 100%; height: 50%; background: appTheme.DarkIndigo;"></div>
    <div class="fft-spectrogram-container">
     <scichart-angular
        [initChart]="chartsInitializationAPI.initFftChart"
        (onInit)="onChartInit($event)"
        style="flex: 1;">
      </scichart-angular>
        <scichart-angular
        [initChart]="chartsInitializationAPI.initSpectogramChart"
        (onInit)="onChartInit($event)"
        style="flex: 1;">
      </scichart-angular>
    </div>
  </div>
</div>
`,
 
})

export class AudioAnalyzerComponent implements AfterViewInit {
    @ViewChild('audioChart') audioChart!: ElementRef;
    
    private chartsInitializationAPI = getChartsInitializationApi();
    private controlsRef: any;
    appTheme = appTheme;
    ngAfterViewInit() {
      this.initializeCharts();
    }
    private async initializeCharts() {
      try {
        await this.chartsInitializationAPI.initAudioChart(this.audioChart.nativeElement);
        this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
        this.controlsRef.handleStart();
        if (this.controlsRef) {
          this.controlsRef.handleStart();
        }
      } catch (error) {
        console.error('Error initializing charts:', error);
      }
    }
}
