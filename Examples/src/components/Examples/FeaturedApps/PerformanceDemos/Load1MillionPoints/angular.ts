import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample, TTimeSpan } from "./drawExample";

interface SciChartControls {
    loadPoints: (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => void;
}

@Component({
    standalone: true,
    imports: [CommonModule, ScichartAngularComponent],
    selector: "app-load1-million-points-chart",
    template: `
        <div class="sc-chart-wrapper">
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="flex: 1;"></scichart-angular>
            <header class="sc-toolbar-row">
                <button id="loadPoints" (click)="reloadPoints()" class="sc-button">Reload Test</button>
                <div *ngIf="timeSpans.length > 0" class="flex-1">
                    <strong>Performance Results</strong>
                    <div *ngFor="let ts of timeSpans">{{ ts.title }}: {{ ts.durationMs.toFixed(0) }} ms</div>
                </div>
            </header>
        </div>
    `,
})
export class AppComponent {
    timeSpans: TTimeSpan[] = [];
    controls?: SciChartControls;

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
