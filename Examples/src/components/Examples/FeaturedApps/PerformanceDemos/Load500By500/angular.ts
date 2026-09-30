import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample, TTimeSpan } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent, CommonModule],
    selector: "app-load500-by500-chart",
    template: `
        <div class="sc-chart-wrapper">
            <scichart-angular
                [initChart]="initChart"
                (onInit)="onInit($event)"
                (onDelete)="onDelete()"
            ></scichart-angular>
            <header class="sc-toolbar-row">
                <button (click)="reloadPoints()" class="sc-button">Reload Test</button>
                <div *ngIf="timeSpans.length > 0" class="sc-toolbar-status sc-alert sc-notification">
                    <strong class="sc-notification-title">Performance Results</strong>
                    <div *ngFor="let ts of timeSpans">{{ ts.title }}: {{ ts.durationMs.toFixed(0) }} ms</div>
                </div>
            </header>
        </div>
    `,
})
export class AppComponent {
    timeSpans: TTimeSpan[] = [];
    controls?: Awaited<ReturnType<typeof drawExample>>["controls"];

    drawExample = (rootElement: string | HTMLDivElement) => {
        return drawExample(rootElement, (newTimeSpans: TTimeSpan[]) => {
            this.updateTimeSpans(newTimeSpans);
        });
    };

    initChart = this.drawExample;

    onInit(initResult: Awaited<ReturnType<typeof drawExample>>): void {
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
