import { Component} from '@angular/core';
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
   <scichart-angular
      [initChart]="chartsInitializationAPI.initAudioChart"
      (onInit)="onChartInit($event)"
       style="flex: 1;">
   </scichart-angular>
    <div class="fft-spectrogram-container">
     <scichart-angular
        [initChart]="chartsInitializationAPI.initFftChart"
        style="flex: 1;">
      </scichart-angular>
        <scichart-angular
        [initChart]="chartsInitializationAPI.initSpectogramChart"
        style="flex: 1;">
      </scichart-angular>
    </div>
  </div>
</div>
`,
 
})


export class AudioAnalyzerComponent  {    
    private chartsInitializationAPI = getChartsInitializationApi();
    private controlsRef: any;
    appTheme = appTheme;

    onChartInit(){
      this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
      this.controlsRef.handleStart();
  }
      
}
