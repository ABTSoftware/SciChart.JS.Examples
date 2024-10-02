import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";

import { drawExample } from "./drawExample";

const SciChartImage =  "/assets/images/scichart-logo-white.png";


@Component({
    selector: 'app-editchart-example',
    template: `
    <scichart-angular
      [initChart]="drawExample"
      style="flex: 1; flex-basis: 50%;">
    </scichart-angular>`
})
export class EditChartExampleComponent  {

    drawExample = drawExample(SciChartImage)
}
