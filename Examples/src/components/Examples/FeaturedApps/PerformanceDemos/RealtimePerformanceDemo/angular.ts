import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";

interface Controls {
  startDemo: () => void;
  stopDemo: () => void;
  setStatsChangedCallback: (callback: (stats: { numberPoints: number; fps: number }) => void) => void;
}

@Component({
  selector: 'app-realtime-performance',
  template: `
  <div class="chart-wrapper">
    <div class="flex-outer-container">
      <div class="toolbar-row">
        <button (click)="startDemo()">Start</button>
        <button (click)="stopDemo()">Stop</button>
        <span class="data-points"># DataPoints: {{stats.numberPoints | number}}</span>
        <span class="fps">FPS: {{stats.fps | number:'1.0-0'}}</span>
      </div>
     <scichart-angular
      [initChart]="drawExample"
      (onInit)="onInit($event)"
      (onDelete)="onDelete($event)"
      style="flex: 1; flex-basis: 50%;">
     </scichart-angular>
    </div>
  </div>
  `,
  styles: [`
  .chart-wrapper {
    width: 100%;
    height: 100%;
  }

  .flex-outer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${appTheme.DarkIndigo}; 
  }

  .toolbar-row {
    display: flex;
    flex-basis: 70px;
    padding: 10px;
    width: 100%;
    color: ${appTheme.ForegroundColor};
  }

  button {
    margin-right: 10px;
    padding: 5px 10px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
     background-color:black ;
     color:white; 
    cursor: pointer;
  }

  button:hover {
     background-color:black ; 
  }
  .chart-area {
    flex: 1;
  }
  `]
})
export class RealtimePerformanceDemoComponent implements OnDestroy {
  stats = { numberPoints: 0, fps: 0 };
  
  constructor() {}
  private initResult: any;
  
  drawExample = drawExample;

  async onInit(initResult: any) {
    this.initResult = initResult;
    this.initResult.controls.setStatsChangedCallback((stats:any) => this.stats = stats);
    this.startDemo();
  }

  ngOnDestroy(): void {
    if (this.initResult && this.initResult.controls) {
      this.initResult.controls.stopDemo();
    }
  }

  startDemo() {
    if (this.initResult && this.initResult.controls) {
      this.initResult.controls.startDemo();
    }
  }

  stopDemo() {
    if (this.initResult && this.initResult.controls) {
      this.initResult.controls.stopDemo();
    }
  }
}
