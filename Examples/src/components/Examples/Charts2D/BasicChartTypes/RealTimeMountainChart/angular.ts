import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-realTimeMountain-chart",
    template: `<scichart-angular
        [initChart]="drawExample"
        (onInit)="onInitHandler($event)"
        (onDelete)="onDeleteHandler($event)"
    ></scichart-angular>`,
})
export class AppComponent {
    public title = "scichart-angular-app";
    public drawExample = drawExample;

    onInitHandler = (initResult: Awaited<ReturnType<typeof drawExample>>) => {
        initResult.controls.handleStart();
    };

    onDeleteHandler = (initResult: Awaited<ReturnType<typeof drawExample>>) => {
        initResult.controls.handleStop();
    };
}
