import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
const customPointImage =  "/assets/images/CustomMarkerImage.png";
import { drawExample } from "./drawExample";

@Component({
  selector: 'app-use-pointer',
   template: `<scichart-angular
      [initChart]="drawExample"
      style="flex: 1; flex-basis: 50%;">
      </scichart-angular>`,
  })
export class UsePointMarkers  {

  drawExample = drawExample(customPointImage)

}
