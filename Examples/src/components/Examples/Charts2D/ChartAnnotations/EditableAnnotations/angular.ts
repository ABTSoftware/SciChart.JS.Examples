import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";

import { drawExample } from "./drawExample";

const SciChartImage = "/assets/images/scichart-logo-white.png";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-editchart-example",
    template: ` <scichart-angular [initChart]="drawExample" style="flex: 1; flex-basis: 50%;"> </scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample(SciChartImage);
}
