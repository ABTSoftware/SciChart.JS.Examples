import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-stack-chart",
    template: `
        <style>
            .toolbar-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        </style>
        <div class="chart-wrapper">
            <div class="toolbar-row">
                <div class="sc-button-group" role="group" aria-label="Stack mode">
                    <button
                        type="button"
                        class="sc-button"
                        [attr.aria-pressed]="!use100PercentStackedMode"
                        (click)="togglePercentageMode(false)"
                    >
                        Stacked mode
                    </button>
                    <button
                        type="button"
                        class="sc-button"
                        [attr.aria-pressed]="use100PercentStackedMode"
                        (click)="togglePercentageMode(true)"
                    >
                        100% Stacked mode
                    </button>
                </div>
                <button type="button" class="sc-button" (click)="toggleDataLabels()">
                    {{ areDataLabelsVisible ? "Show Data Labels" : "Hide Data Labels" }}
                </button>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="flex: 1; flex-basis: 50%;">
            </scichart-angular>
        </div>
    `,
})
export class AppComponent {
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
