import { Component } from "@angular/core";
import { drawExample } from "./drawExample";

const emojiUrls = [
    "/assets/images/apple.png",
    "/assets/images/samsung.png",
    "/assets/images/xiaomi.png",
    "/assets/images/Huawei.png",
    "/assets/images/oppo.png",
    "/assets/images/vivo.png",
    "/assets/images/realme.png",
    "/assets/images/motorola.png",
    "/assets/images/question.png",
    "/assets/images/Lg.png",
    "/assets/images/oneplus.png",
    "/assets/images/tecno.png",
    "/assets/images/infinix.png",
    "/assets/images/google.png",
    "/assets/images/nokia.png",
];

@Component({
    selector: "app-Image-labels",
    template: `
    <scichart-angular
      [initChart]="drawExample"
      style="flex: 1; flex-basis: 50%;">
     </scichart-angular>`,
})
export class ChartComponent  {

    drawExample = drawExample(emojiUrls); 

}
