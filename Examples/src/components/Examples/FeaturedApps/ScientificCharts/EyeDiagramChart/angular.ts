import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-eye-diagram-chart",
    template: `
        <div style="width: 100%; height: 100%;">
            <scichart-angular
                [initChart]="initChart"
                (onInit)="onInit($event)"
                (onDelete)="onDelete($event)"
                style="width: 100%; height: 100%;"
            ></scichart-angular>
        </div>
    `,
})
export class AppComponent {
    initChart = drawExample;
    private controls?: { startAnimation: () => void; stopAnimation: () => void; cleanup: () => void };

    onInit(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls = initResult.controls;
        this.controls.startAnimation();
    }

    onDelete(initResult: Awaited<ReturnType<typeof drawExample>>) {
        this.controls?.cleanup();
    }
}
