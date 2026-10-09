import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";

import { drawExample, drawHeatmapLegend } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent, CommonModule],
    selector: "app-heatmap-chart",
    template: `
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <button type="button" (click)="togglePlayback()" [disabled]="!initResult" class="sc-button">
                    {{ isRunning ? "Pause" : "Start" }}
                </button>
                <span class="monospace">Heatmap size: {{ stats.xSize }} × {{ stats.ySize }}</span>
                <span class="monospace">FPS: {{ stats.fps.toFixed(0).padStart(2, "0") }}</span>
            </div>
            <div style="position: relative;">
                <scichart-angular
                    [initChart]="drawExample"
                    (onInit)="onInit($event)"
                    (onDelete)="onDelete($event)"
                    style="display: block; width: 100%; height: 100%;"
                ></scichart-angular>
                <scichart-angular
                    [initChart]="drawHeatmapLegend"
                    style="position: absolute; height: 100%; width: 65px; top: 0; right: 0;"
                ></scichart-angular>
            </div>
        </div>
    `,
})
export class AppComponent {
    isRunning = false;
    stats = { xSize: 0, ySize: 0, fps: 0 };
    drawExample = drawExample;
    drawHeatmapLegend = drawHeatmapLegend;

    public initResult?: Awaited<ReturnType<typeof drawExample>>;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.initResult = initResult;
        this.initResult.subscribeToRenderStats((stats: any) => (this.stats = stats));
        this.startUpdate();
    }

    togglePlayback() {
        if (this.isRunning) this.stopUpdate();
        else this.startUpdate();
    }

    startUpdate() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.startUpdate();
            this.isRunning = true;
        }
    }

    stopUpdate() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopUpdate();
            this.isRunning = false;
        }
    }
    onDelete(initResult: Awaited<ReturnType<typeof drawExample>>) {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopUpdate();
        }
    }
}
