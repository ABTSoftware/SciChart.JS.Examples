import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SciChartSurface, chartReviver, localStorageApi } from "scichart";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ScichartAngularComponent],
    selector: "app-user-annotated-stock-chart",
    template: `
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <div class="sc-button-group" role="group" aria-label="Chart mode">
                    <button
                        type="button"
                        class="sc-button"
                        [attr.aria-pressed]="chartMode === 'pan'"
                        (click)="onChartModeChange('pan')"
                    >
                        Pan
                    </button>
                    <button
                        type="button"
                        class="sc-button"
                        [attr.aria-pressed]="chartMode === 'line'"
                        (click)="onChartModeChange('line')"
                    >
                        Lines
                    </button>
                    <button
                        type="button"
                        class="sc-button"
                        [attr.aria-pressed]="chartMode === 'marker'"
                        (click)="onChartModeChange('marker')"
                    >
                        Markers
                    </button>
                </div>
                <input
                    class="sc-input"
                    type="text"
                    placeholder="Save as"
                    aria-label="Chart name"
                    [(ngModel)]="name"
                    (ngModelChange)="onNameChanged($event)"
                />
                <button type="button" (click)="saveChart()" class="sc-button">Save</button>
                <select
                    class="sc-select"
                    aria-label="Load From"
                    [(ngModel)]="selectedChart"
                    (ngModelChange)="onSelectionChanged($event)"
                >
                    <option value="" disabled>Load From</option>
                    <option *ngFor="let chartName of getChartNames()" [value]="chartName">{{ chartName }}</option>
                </select>
                <button type="button" (click)="loadChart()" class="sc-button sc-button-outline">Load</button>
                <button type="button" (click)="resetChart()" class="sc-button sc-button-destructive">Reset</button>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)"></scichart-angular>
        </div>
    `,
})
export class AppComponent implements OnInit {
    chartMode: string = "line";
    name: string = "";
    savedCharts: Record<string, object> = {};
    selectedChart: string = "";
    controlsRef: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
    sciChartSurfaceRef: SciChartSurface | undefined;

    readonly STORAGE_KEY = "Annotated-Charts";

    drawExample = drawExample;
    private initResult?: Awaited<ReturnType<typeof drawExample>>;
    ngOnInit(): void {
        if (localStorageApi.storageAvailable()) {
            this.savedCharts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? "{}", chartReviver);
        }
    }

    onChartModeChange(mode: string): void {
        this.chartMode = mode;
        this.controlsRef?.setChartMode(this.chartMode);
    }

    onNameChanged(value: string): void {
        this.name = value;
    }

    onSelectionChanged(name: string): void {
        this.selectedChart = name;
    }

    saveChart(): void {
        if (this.controlsRef) {
            this.savedCharts[this.name] = this.controlsRef.getDefinition();
            if (localStorageApi.storageAvailable()) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.savedCharts));
            }
            this.selectedChart = this.name;
        }
    }

    loadChart(): void {
        if (this.controlsRef) {
            const definition = this.savedCharts[this.selectedChart];
            this.name = this.selectedChart;
            this.controlsRef.resetChart();
            this.controlsRef.applyDefinition(definition);
        }
    }

    resetChart(): void {
        this.controlsRef?.resetChart();
    }

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.initResult = initResult;
        this.sciChartSurfaceRef = this.initResult.sciChartSurface;
        this.controlsRef = this.initResult.controls;
    }

    getChartNames(): string[] {
        return Object.keys(this.savedCharts);
    }
}
