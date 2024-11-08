import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { appTheme } from "../../../theme";
import { ScichartAngularComponent } from "scichart-angular";

import { drawExample, drawHeatmapLegend } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent, CommonModule],
    selector: "app-heatmap-chart",
    template: `
        <style>
            .chart-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: rgb(20, 35, 60);
            }

            .flex-outer-container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .toolbar-row {
                display: flex;
                flex-basis: 70px;
                padding-left: 27px;
                padding-top: 10px;
                margin-top: 19px;
                width: 100%;
                color: {appTheme.ForegroundColor};
            }
            .toolbar-button {
                color: {appTheme.ForegroundColor};
                background: rgb(20, 35, 60) !important;
            }
            .chart-area {
                flex: 1;
                position: relative;
            }

            .chart-container {
                width: 100%;
                height: 100%;
            }

            .legend-container {
                position: absolute;
                height: 90%;
                width: 100px;
                top: 0;
                right: 75px;
                margin: 20px;
            }

            .stats-info {
                margin: 12px;
            }

            .chart-example {
                flex: 1;
                flex-basis: 50%;
            }

            .chart-legend {
                position: absolute;
                height: 90%;
                width: 100px;
                top: 0;
                right: 75px;
                margin: 20px;
            }
        </style>
        <div class="chart-wrapper">
            <div class="flex-outer-container">
                <div class="toolbar-row">
                    <button
                        mat-raised-button
                        (click)="startUpdate()"
                        [ngStyle]="{ color: '#FFFFFF' }"
                        class="toolbar-button"
                    >
                        Start</button
                    >&nbsp;
                    <button
                        mat-raised-button
                        (click)="stopUpdate()"
                        [ngStyle]="{ color: '#FFFFFF' }"
                        class="toolbar-button"
                    >
                        Stop
                    </button>
                    <span class="stats-info"> # Heatmap Size: {{ stats.xSize }} x {{ stats.ySize }} </span>
                    <span class="stats-info"> FPS: {{ stats.fps.toFixed(0).padStart(2, "0") }} </span>
                </div>
                <div class="chart-area">
                    <scichart-angular
                        [initChart]="drawExample"
                        (onInit)="onInit($event)"
                        (onDelete)="onDelete($event)"
                        class="chart-example"
                    >
                    </scichart-angular>
                    <scichart-angular [initChart]="drawHeatmapLegend" class="chart-legend"> </scichart-angular>
                </div>
            </div>
        </div>
    `,
})
export class AppComponent {
    appTheme = appTheme;
    stats = { xSize: 0, ySize: 0, fps: 0 };
    drawExample = drawExample;
    drawHeatmapLegend = drawHeatmapLegend;

    public initResult?: Awaited<ReturnType<typeof drawExample>>;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.initResult = initResult;
        this.initResult.subscribeToRenderStats((stats: any) => (this.stats = stats));
        this.startUpdate();
    }

    startUpdate() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.startUpdate();
        }
    }

    stopUpdate() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopUpdate();
        }
    }
    onDelete(initResult: Awaited<ReturnType<typeof drawExample>>) {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopUpdate();
        }
    }
}
