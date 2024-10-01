import { Component } from "@angular/core";
import { drawExample } from "./drawExample";

@Component({
    selector: "app-realTimeMountain-chart",
    template: `<scichart-angular
        [initChart]="drawExample"
        (onInit)="onInitHandler($event)"
        (onDelete)="onDeleteHandler($event)"
    ></scichart-angular>`,
})
export class AppRealTimeMountainComponent {
    public title = "scichart-angular-app";
    public drawExample = drawExample;

    onInitHandler = (initResult: Awaited<ReturnType<typeof drawExample>>) => {
        initResult.controls.handleStart();
    };

    onDeleteHandler = (initResult: Awaited<ReturnType<typeof drawExample>>) => {
        initResult.controls.handleStop();
    };
}
