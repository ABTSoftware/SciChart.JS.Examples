import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { getChartsInitializationApi } from "./drawExample";

@Component({
    standalone: true,
    imports: [CommonModule, ScichartAngularComponent],
    selector: "app-heatmap-interactions",
    template: `
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <button type="button" (click)="togglePlayback()" [disabled]="!controlsRef" class="sc-button">
                    {{ isRunning ? "Stop" : "Start" }}
                </button>
                <div class="sc-button-group" role="group" aria-label="Simulation">
                    <button
                        type="button"
                        (click)="loadBasicExample()"
                        [disabled]="!controlsRef"
                        [attr.aria-pressed]="simulation === 'basic'"
                        class="sc-button"
                    >
                        Basic
                    </button>
                    <button
                        type="button"
                        (click)="loadDoubleSlitExample()"
                        [disabled]="!controlsRef"
                        [attr.aria-pressed]="simulation === 'doubleSlit'"
                        class="sc-button"
                    >
                        Double slit
                    </button>
                </div>
                <button
                    type="button"
                    (click)="showHelp()"
                    [disabled]="!controlsRef"
                    class="sc-button sc-button-icon"
                    aria-label="Show help"
                    title="Show help"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
                        <path d="M11 10h2v7h-2zm0-4h2v2h-2z" />
                    </svg>
                </button>
            </div>
            <div style="display: flex; flex-direction: row;">
                <scichart-angular
                    [initChart]="chartsInitializationAPI.initMainChart"
                    (onInit)="onChartInit($event, 'main')"
                    style="flex: 1; flex-basis: 50%;"
                >
                </scichart-angular>
                <scichart-angular
                    [initChart]="chartsInitializationAPI.initCrossSectionChart"
                    (onInit)="onChartInit($event, 'crossSection')"
                    style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                >
                </scichart-angular>
            </div>
            <div style="display: flex; flex-direction: row;">
                <scichart-angular
                    [initChart]="chartsInitializationAPI.inputChart"
                    (onInit)="onChartInit($event, 'input')"
                    style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                >
                </scichart-angular>
                <scichart-angular
                    [initChart]="chartsInitializationAPI.initHistoryChart"
                    (onInit)="onChartInit($event, 'history')"
                    style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                >
                </scichart-angular>
            </div>
        </div>
    `,
})
export class AppComponent {
    isRunning = false;
    simulation = "basic";

    chartsInitializationAPI = getChartsInitializationApi();
    mainChart?: Awaited<ReturnType<typeof this.chartsInitializationAPI.initMainChart>>;
    crossSectionChart?: Awaited<ReturnType<typeof this.chartsInitializationAPI.initCrossSectionChart>>;
    inputChart?: Awaited<ReturnType<typeof this.chartsInitializationAPI.inputChart>>;
    historyChart?: Awaited<ReturnType<typeof this.chartsInitializationAPI.initHistoryChart>>;
    controlsRef?: Awaited<ReturnType<typeof this.chartsInitializationAPI.onAllChartsInit>>;

    async onChartInit(event: any, chartType: "main" | "crossSection" | "input" | "history") {
        if (event?.sciChartSurface) {
            switch (chartType) {
                case "main":
                    this.mainChart = event.sciChartSurface;
                    break;
                case "crossSection":
                    this.crossSectionChart = event.sciChartSurface;
                    break;
                case "input":
                    this.inputChart = event.sciChartSurface;
                    break;
                case "history":
                    this.historyChart = event.sciChartSurface;
                    break;
            }

            if (this.mainChart && this.crossSectionChart && this.inputChart && this.historyChart) {
                this.configureCharts();
            }
        } else {
            console.log("Chart not initialized!");
        }
    }

    private configureCharts() {
        this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
        this.isRunning = true;
    }

    togglePlayback(): void {
        if (!this.controlsRef) return;
        if (this.isRunning) this.controlsRef.stopUpdate();
        else this.controlsRef.startUpdate();
        this.isRunning = !this.isRunning;
    }

    loadBasicExample(): void {
        this.simulation = "basic";
        this.controlsRef?.twoPoint();
        this.isRunning = true;
    }

    loadDoubleSlitExample(): void {
        this.simulation = "doubleSlit";
        this.controlsRef?.interference();
        this.isRunning = true;
    }

    showHelp(): void {
        this.controlsRef?.showHelp();
    }
}
