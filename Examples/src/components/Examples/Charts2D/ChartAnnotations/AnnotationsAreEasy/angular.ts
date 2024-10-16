import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";

import { drawExample } from "./drawExample";

const CustomImage = "/assets/images/scichart-logo-white.png";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-chart-example",
    template: ` <scichart-angular [initChart]="drawExample" style="flex: 1; flex-basis: 50%;"> </scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample(CustomImage);
}
