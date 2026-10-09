import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-stack-chart",
    template: `
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <label class="sc-switch">
                    <input
                        type="checkbox"
                        [checked]="use100PercentStackedMode"
                        (change)="togglePercentageMode($any($event.target).checked)"
                    />100% mode
                </label>
                <label class="sc-switch">
                    <input type="checkbox" [checked]="areDataLabelsVisible" (change)="toggleDataLabels()" />Show data
                    labels
                </label>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)"></scichart-angular>
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
