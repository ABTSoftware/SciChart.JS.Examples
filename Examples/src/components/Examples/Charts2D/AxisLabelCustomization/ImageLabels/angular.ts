import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
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
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-root",
    template: `<scichart-angular [initChart]="drawExample"> </scichart-angular>`,
})
export class AppComponent {
    drawExample = drawExample(emojiUrls);
}
