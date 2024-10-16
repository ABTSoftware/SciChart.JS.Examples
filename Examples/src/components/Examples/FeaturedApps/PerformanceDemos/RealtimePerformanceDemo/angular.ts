import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-realtime-performance",
    template: `
        <div class="chart-wrapper">
            <div class="flex-outer-container">
                <div class="toolbar-row">
                    <button (click)="startDemo()">Start</button>
                    <button (click)="stopDemo()">Stop</button>
                    <span class="data-points"># DataPoints: {{ stats.numberPoints.toLocaleString() }}</span>
                    <span class="fps">FPS: {{ stats.fps.toFixed(0) }}</span>
                </div>
                <scichart-angular
                    [initChart]="drawExample"
                    (onInit)="onInit($event)"
                    (onDelete)="onDelete()"
                    style="flex: 1; flex-basis: 50%;"
                >
                </scichart-angular>
            </div>
        </div>
    `,
    styles: [
        `
            .chart-wrapper {
                width: 100%;
                height: 100%;
            }

            .flex-outer-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #1f0954;
            }

            .toolbar-row {
                display: flex;
                flex-basis: 70px;
                padding: 10px;
                width: 100%;
                color: white;
            }

            button {
                margin-right: 10px;
                padding: 5px 10px;
                font-size: 16px;
                border: none;
                border-radius: 4px;
                background-color: black;
                color: white;
                cursor: pointer;
            }

            button:hover {
                background-color: black;
            }
            .chart-area {
                flex: 1;
            }
        `,
    ],
})
export class AppComponent {
    stats = { numberPoints: 0, fps: 0 };

    constructor() {}
    private initResult?: Awaited<ReturnType<typeof drawExample>>;

    drawExample = drawExample;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.initResult = initResult;
        this.initResult.controls.setStatsChangedCallback((stats: any) => (this.stats = stats));
        this.startDemo();
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

    onDelete() {
        if (this.initResult && this.initResult.controls) {
            this.initResult.controls.stopDemo();
        }
    }
}
