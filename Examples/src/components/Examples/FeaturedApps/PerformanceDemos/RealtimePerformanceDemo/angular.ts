import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-realtime-performance",
    template: `
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <button type="button" (click)="togglePlayback()" [disabled]="!initResult" class="sc-button">
                    {{ isRunning ? "Pause" : "Start" }}
                </button>
                <span class="monospace">Data points: {{ stats.numberPoints.toLocaleString() }}</span>
                <span class="monospace">FPS: {{ stats.fps.toFixed(0) }}</span>
            </div>
            <scichart-angular
                [initChart]="drawExample"
                (onInit)="onInit($event)"
                (onDelete)="onDelete()"
            ></scichart-angular>
        </div>
    `,
})
export class AppComponent {
    isRunning = false;
    stats = { numberPoints: 0, fps: 0 };

    constructor() {}
    protected initResult?: Awaited<ReturnType<typeof drawExample>>;

    drawExample = drawExample;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.initResult = initResult;
        this.initResult.controls.setStatsChangedCallback((stats: any) => (this.stats = stats));
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

    onDelete() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopUpdate();
        }
    }
}
