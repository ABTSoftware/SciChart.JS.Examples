import { Component, OnInit } from "@angular/core";
import { SciChartSurface, chartReviver, localStorageApi } from "scichart";
import { drawExample, IChartControls } from "./drawExample";
import { appTheme } from "../../../theme";
@Component({
    selector: "app-user-annotated-stock-chart",
    template: `
        <style>
            .toolbar-row {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px;
                background: ${appTheme.DarkIndigo};
                align-items: center;
            }

            mat-button-toggle-group {
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 4px;
                height: 40px;
                display: flex;
                align-items: center;
            }

            mat-button-toggle {
                border: 1px solid #444;
                border-radius: 4px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
            }

            mat-form-field {
                height: 40px;
                flex-grow: 1;
                display: flex;
                align-items: flex-end;
                border: 1px solid #ccc;
                border-radius: 4px;
                overflow: hidden;
                background-color: white;
            }

            mat-form-field mat-select,
            mat-form-field mat-input {
                height: 100%;
                padding: 0 10px;
                border: none;
                width: 100%;
                background-color: transparent;
                box-sizing: border-box;
            }

            mat-form-field mat-select {
                display: flex;
                align-items: flex-end;
                height: auto;
            }

            mat-form-field mat-input {
                display: flex;
                align-items: flex-end;
                height: auto;
            }

            mat-form-field .mat-form-field-wrapper {
                height: 100%;
                display: flex;
                align-items: flex-end;
            }

            .mat-mdc-form-field-subscript-wrapper {
                display: none;
            }

            button {
                border: 1px solid #888;
                border-radius: 4px;
                margin-right: 10px;
                padding: 8px 16px;
                color: #fff;
                height: 40px;
                align-self: center;
            }

            button:hover {
                background: #5a5a5a;
            }

            .mat-mdc-button:not(:disabled) {
                color: #fff;
            }

            .mat-mdc-button:not(:disabled):hover {
                color: #e0e0e0;
            }
            ::ng-deep .mat-mdc-form-field-subscript-wrapper {
                display: none;
            }

            mat-button-toggle {
                color: white;
                transition: color 0.3s;
            }

            mat-button-toggle:hover {
                color: black;
            }

            mat-button-toggle.mat-button-toggle-checked {
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
            }

            mat-button-toggle:hover.mat-button-toggle-checked {
                color: white;
            }
        </style>
        <div class="chart-wrapper">
            <div class="flex-outer-container">
                <div class="toolbar-row">
                    <mat-button-toggle-group
                        (change)="onChartModeChange($event)"
                        [value]="chartMode"
                        appearance="outline"
                        color="primary"
                    >
                        <mat-button-toggle value="pan">Pan</mat-button-toggle>
                        <mat-button-toggle value="line">Lines</mat-button-toggle>
                        <mat-button-toggle value="marker">Markers</mat-button-toggle>
                    </mat-button-toggle-group>
                    <mat-form-field>
                        <input
                            matInput
                            placeholder="Save As"
                            [(ngModel)]="name"
                            (ngModelChange)="onNameChanged($event)"
                        />
                    </mat-form-field>
                    <button mat-button (click)="saveChart()">Save</button>
                    <mat-form-field>
                        <mat-select
                            placeholder="Load From"
                            [(ngModel)]="selectedChart"
                            (selectionChange)="onSelectionChanged($event)"
                        >
                            <mat-option *ngFor="let name of getChartNames()" [value]="name">{{ name }}</mat-option>
                        </mat-select>
                    </mat-form-field>
                    <button mat-button (click)="loadChart()">Load</button>
                    <button mat-button (click)="resetChart()">Reset</button>
                </div>
                <div>
                    <scichart-angular
                        [initChart]="drawExample"
                        (onInit)="onInit($event)"
                        style="flex: 1; flex-basis: 50%;"
                    >
                    </scichart-angular>
                </div>
            </div>
        </div>
    `,
})
export class UserAnnotatedStockChartComponent implements OnInit {
    chartMode: string = "line";
    name: string = "";
    savedCharts: Record<string, object> = {};
    selectedChart: string = "";
    controlsRef: IChartControls | undefined;
    sciChartSurfaceRef: SciChartSurface | undefined;

    readonly STORAGE_KEY = "Annotated-Charts";

    drawExample = drawExample;
    private initResult?: Awaited<ReturnType<typeof drawExample>>;
    ngOnInit(): void {
        if (localStorageApi.storageAvailable()) {
            this.savedCharts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? "{}", chartReviver);
        }
    }

    onChartModeChange(event: any): void {
        this.chartMode = event.value;
        this.controlsRef?.setChartMode(this.chartMode);
    }

    onNameChanged(value: string): void {
        this.name = value;
    }

    onSelectionChanged(event: any): void {
        this.selectedChart = event.value;
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

interface DrawExampleResult {
    sciChartSurface: SciChartSurface;
    controls: IChartControls;
}
