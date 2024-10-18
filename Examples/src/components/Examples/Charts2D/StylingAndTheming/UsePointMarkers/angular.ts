import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
const customPointImage = "/assets/images/CustomMarkerImage.png";
import { drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-use-pointer",
    template: `<scichart-angular [initChart]="drawExample" style="flex: 1; flex-basis: 50%;"> </scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample(customPointImage);
}
