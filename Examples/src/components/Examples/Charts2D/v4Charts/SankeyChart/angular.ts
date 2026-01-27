import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample } from "./drawExample";

@Component({
    selector: "app-sankey-chart",
    imports: [ScichartAngularComponent],
    template: `<scichart-angular [initChart]="drawExample" style="flex: 1;"></scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample;
}
