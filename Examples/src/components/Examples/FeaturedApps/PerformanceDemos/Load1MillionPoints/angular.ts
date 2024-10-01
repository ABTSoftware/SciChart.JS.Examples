import { Component, OnInit, OnDestroy } from "@angular/core";
import { drawExample, TTimeSpan } from "./drawExample";
import { appTheme } from "../../../theme";
interface SciChartControls {
    loadPoints: (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => void;
}
@Component({
    selector: "app-load1-million-points-chart",
    template: `
        <style>
            .chart-wrapper {
                width: 100%;
                height: 100%;
            }
            .flex-outer-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #14233c;
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
            }

            .notification-container {
                width: 80%;
                margin-left: 10px;
                background-color: #264b93;
                color: #264b93;
            }

            .notification-card {
                color: #ecf0f1;
            }

            .notification-card-header {
                color: #ecf0f1;
            }

            .notification-card-content {
                margin-top: 10px;
                font-size: 14px;
                line-height: 1.5;
            }

            .performance-result {
                margin-bottom: 8px;
            }

            .mat-mdc-card {
                background-color: #264b93 !important;
            }
        </style>
        <div class="chart-wrapper">
            <div class="flex-outer-container">
                <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="flex: 1; flex-basis: 50%;">
                </scichart-angular>
                <div class="toolbar-row">
                    <button id="loadPoints" (click)="reloadPoints()" [style.color]="theme" class="reload-button">
                        🗘 Reload Test
                    </button>
                    <div class="notification-container">
                        <ng-container *ngIf="timeSpans.length > 0">
                            <mat-card class="notification-card">
                                <mat-card-header class="notification-card-header">
                                    <mat-card-title>Performance Results</mat-card-title>
                                </mat-card-header>
                                <mat-card-content class="notification-card-content">
                                    <div
                                        *ngFor="let ts of timeSpans; let i = index"
                                        [attr.key]="i"
                                        class="performance-result"
                                    >
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
})
export class Load1MillionPointsChartComponent implements OnInit {
    timeSpans: TTimeSpan[] = [];
    controls?: SciChartControls;
    theme: any;
    ngOnInit(): void {
        this.theme = appTheme.ForegroundColor;
    }

    drawExample = drawExample;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls = initResult.controls;
        this.controls.loadPoints(this.updateTimeSpans.bind(this));
    }

    private updateTimeSpans(newTimeSpans: TTimeSpan[]): void {
        this.timeSpans = [...newTimeSpans];
    }

    reloadPoints(): void {
        this.controls?.loadPoints(this.updateTimeSpans.bind(this));
    }
}
