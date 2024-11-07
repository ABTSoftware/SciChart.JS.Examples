import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-custom-filter",
    template: `
        <scichart-angular
            [initChart]="drawExample"
            (onInit)="onInit($event)"
            (onDelete)="stopUpdate()"
            style="flex: 1; flex-basis: 50%;"
        >
        </scichart-angular>
    `,
})
export class AppComponent {
    private controls?: Awaited<ReturnType<typeof drawExample>>["controls"];

    async onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls = initResult.controls;
        this.controls.startUpdate();
    }

    stopUpdate() {
        if (this.controls) {
            this.controls.stopUpdate();
        }
    }

    drawExample = drawExample;
}
