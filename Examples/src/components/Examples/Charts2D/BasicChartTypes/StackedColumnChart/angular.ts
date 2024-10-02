import { Component } from "@angular/core";
import { drawExample } from "./drawExample";

@Component({
    selector: "app-stack-chart",
    template: `
        <style>
            button.custom-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base {
                padding: 2rem !important;
                height: 100%;
                border: 1px solid;
            }
            .toolbar-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .toggle-group {
                display: flex;
            }
        </style>
        <div class="chart-wrapper">
            <div class="toolbar-row">
                <mat-button-toggle-group
                    (change)="togglePercentageMode($event.value)"
                    [value]="use100PercentStackedMode"
                >
                    <mat-button-toggle class="custom-button" [value]="false">Stacked mode</mat-button-toggle>
                    <mat-button-toggle class="custom-button" [value]="true">100% Stacked mode</mat-button-toggle>
                </mat-button-toggle-group>
                <button mat-button class="custom-button" (click)="toggleDataLabels()">
                    {{ areDataLabelsVisible ? "Show Data Labels" : "Hide Data Labels" }}
                </button>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="flex: 1; flex-basis: 50%;">
            </scichart-angular>
        </div>
    `,
})
export class StackedColumnChart {
    title = "StackedColumnChart";

    use100PercentStackedMode = false;
    areDataLabelsVisible = false;
    controls?: Awaited<ReturnType<typeof drawExample>>["controls"];

    drawExample = drawExample;

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls = initResult.controls;
    }

    togglePercentageMode(value: boolean) {
        this.use100PercentStackedMode = value;
        this.controls?.toggleHundredPercentMode?.(value);
    }

    toggleDataLabels() {
        this.areDataLabelsVisible = !this.areDataLabelsVisible;
        this.controls?.toggleDataLabels?.(this.areDataLabelsVisible);
    }
}
