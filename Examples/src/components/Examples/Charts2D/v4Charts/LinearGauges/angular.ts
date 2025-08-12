import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    selector: "app-root",
    imports: [ScichartAngularComponent],
    template: `<scichart-angular [initChart]="drawExample"></scichart-angular>`,
})
export class AppComponent {
    title = "scichart-angular-app";

    drawExample = drawExample;
}
