import { Component } from "@angular/core";
import { drawExample } from "./drawExample";

@Component({
    selector: "app-custom-filter",
    template: `
        <scichart-angular
            [initChart]="drawExample"
            (onInit)="onInit($event)"
            (onDelete)="stopDemo($event)"
            style="flex: 1; flex-basis: 50%;"
        >
        </scichart-angular>
    `,
})
export class CustomFilters {
    private controls?: Awaited<ReturnType<typeof drawExample>>["controls"];

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls = initResult.controls;
        this.startDemo();
    }

    startDemo() {
        if (this.controls) {
            this.startDemo();
        }
    }

    stopDemo() {
        if (this.controls) {
            this.controls.stopDemo();
        }
    }

    drawExample = drawExample;
}
