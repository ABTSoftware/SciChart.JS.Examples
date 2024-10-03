import { Component } from "@angular/core";

import { drawExample } from "./drawExample";

const CustomImage = "/assets/images/scichart-logo-white.png";

@Component({
    selector: "app-chart-example",
    template: ` <scichart-angular [initChart]="drawExample" style="flex: 1; flex-basis: 50%;"> </scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample(CustomImage);
}
