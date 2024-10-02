import { Component } from "@angular/core";
import { drawExample } from "./drawExample";

@Component({
    selector: "app-root",
    template: `<scichart-angular [initChart]="drawExample"></scichart-angular>`,
})
export class AppComponent {
    title = "scichart-angular-app";

    drawExample = drawExample;
}
