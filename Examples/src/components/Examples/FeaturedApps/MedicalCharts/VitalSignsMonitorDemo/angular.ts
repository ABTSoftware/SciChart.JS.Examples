import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { appTheme } from '../../../theme'; 
import { TDataUpdateInfo,drawExample } from './drawExample';


@Component({
  selector: 'app-vital-signs-monitor',
  template: `
  <style>
  .chart-wrapper {
  height: 100%;
}

.chart-container {
  flex: 1;
}

.info-box-container {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.info-box {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.ib-row1 {
  display: flex;
  justify-content: space-between;
}

.ib-row1-col1 {
  font-weight: bold;
}

.ib-row2 {
  display: flex;
  justify-content: space-between;
}

.ib-row2-col1 {
  width: 50%;
}

.ib-row2-col2 {
  width: 50%;
}

  </style>
  <div class="chart-wrapper">
  <div style="display: flex; height: 100%;">
     <scichart-angular
        [initChart]="drawExample"
        (onInit)="onChartInit($event)"
        style="flex: 1; flex-basis: 50%;">
      </scichart-angular>
    <div class="info-box-container">
      <div class="info-box" [ngStyle]="{ 'color': appTheme.VividOrange, 'background': appTheme.Background }">
        <div class="info-box-row1">
          <div class="info-box-row1-col1">ECG</div>
        </div>
        <div class="info-box-row2">
          <div class="info-box-row2-col1">
            <div>
              V1 - 1.4MM<br />
              ST | +0.6 || +0.9
            </div>
          </div>
          <div class="info-box-row2-col2">
            <div>{{ infoEcg }}</div>
          </div>
        </div>
      </div>
      <div class="info-box" [ngStyle]="{ 'color': appTheme.VividSkyBlue, 'background': appTheme.Background }">
        <div class="info-box-row1">
          <div class="info-box-row1-col1">NIBP</div>
          <div class="info-box-row1-col2">
            AUTO<br />
            145/95
          </div>
        </div>
        <div class="info-box-row2">
          <div class="info-box-row2-col2">
            <div>{{ infoBloodPressure1 }}/{{ infoBloodPressure2 }}</div>
          </div>
        </div>
      </div>
      <div class="info-box" [ngStyle]="{ 'color': appTheme.VividPink, 'background': appTheme.Background }">
        <div class="info-box-row1">
          <div class="info-box-row1-col1">SV</div>
          <div class="info-box-row1-col2">
            ML 100<br />
            %**** 55
          </div>
        </div>
        <div class="info-box-row2">
          <div class="info-box-row2-col2">
            <div>{{ infoBloodVolume.toFixed(1) }}</div>
          </div>
        </div>
      </div>
      <div class="info-box" [ngStyle]="{ 'color': appTheme.VividTeal, 'background': appTheme.Background }">
        <div class="info-box-row1">
          <div class="info-box-row1-col1">SPO<span style="font-size: 12px">2</span></div>
          <div class="info-box-row1-col2">18:06</div>
        </div>
        <div class="info-box-row2">
          <div class="info-box-row2-col1">
            <div>
              71-<br />
              RESP
            </div>
          </div>
          <div class="info-box-row2-col2">
            <div>{{ infoBloodOxygenation }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

`,
})
export class VitalSignsMonitorComponent {

  private timerId: any;
  private currentPoint = 0;
  appTheme = appTheme;
  public infoEcg: number = 0;
  public infoBloodPressure1: number = 0;
  public infoBloodPressure2: number = 0;
  public infoBloodVolume: number = 0;
  public infoBloodOxygenation: number = 0;
  drawExample = drawExample;
  private dataUpdateCallback: ((info: TDataUpdateInfo) => void) | null = null;


  onChartInit(event:any){
    let initResult = event
        if (initResult.subscribeToDataUpdates) {
          this.dataUpdateCallback = (info: TDataUpdateInfo) => {
            this.infoEcg = info.ecg;
            this.infoBloodPressure1 = info.bloodPressure1;
            this.infoBloodPressure2 = info.bloodPressure2;
            this.infoBloodVolume = info.bloodVolume;
            this.infoBloodOxygenation = info.bloodOxygenation;
          };
          initResult.subscribeToDataUpdates(this.dataUpdateCallback);
        }
  
        if (initResult.controls.handleStart) {
          initResult.controls.handleStart();
        }
  }


}
