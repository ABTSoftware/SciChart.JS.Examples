import { Component } from '@angular/core';
import { drawExample, TTimeSpan } from './drawExample';
import { appTheme } from '../../../theme';

interface SciChartControls {
  startUpdate: () => void;
  stopUpdate: () => void;
}

@Component({
  selector: 'app-load500-by500-chart',
  template: `
  <div class="chart-wrapper">
    <div class="flex-outer-container">
      <scichart-angular
        [initChart]="initChart"
        (onInit)="onInit($event)"
        (onDelete)="onDelete()"
        style="flex: 1;">
      </scichart-angular>
      <div class="toolbar-row">
        <button
          (click)="reloadPoints()"
          class="reload-button">
          🗘 Reload Test
        </button>
        <div class="notification-container">
          <ng-container *ngIf="timeSpans.length > 0">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Performance Results</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div *ngFor="let ts of timeSpans; let i = index">
                  {{ ts.title }}: {{ ts.durationMs.toFixed(0) }} ms
                </div>
              </mat-card-content>
            </mat-card>
          </ng-container>
        </div>
      </div>
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
      background: #14233C;
    }
    .toolbar-row {
      display: flex;
      padding: 10px;
      width: 100%;
      min-height: 140px;
      color: #ecf0f1;
      align-items: center;
    }
    .reload-button {
      margin-right: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #ecf0f1;
    }
    .notification-container {
      width: 80%;
      margin-left: 10px;
      background-color: #264B93;
      color: #ecf0f1;
    }
    .mat-card {
      background-color: #264B93 !important;
    }
      .mat-mdc-card {
     background-color:#264B93 !important
    }

  `]
})
export class Load500By500ChartComponent {
  timeSpans: TTimeSpan[] = [];
  controls?: SciChartControls;
  private initResult?: any;


  drawExample = (rootElement: any, updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => {
    return drawExample(rootElement, (newTimeSpans: TTimeSpan[]) => {
      this.updateTimeSpans(newTimeSpans);
    });
  }

  initChart = this.drawExample;

  onInit(initResult: any): void {
    this.initResult = initResult;
    this.controls = initResult.controls;
    this.controls?.startUpdate();
  }

  onDelete(): void {
    this.controls?.stopUpdate();
  }

  private updateTimeSpans(newTimeSpans: TTimeSpan[]): void {
    this.timeSpans = [...newTimeSpans];
  }

  reloadPoints(): void {
    this.controls?.startUpdate();
  }
}
