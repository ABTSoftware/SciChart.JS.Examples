import { Component } from '@angular/core';
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    title = 'scichart-angular-app';

    drawExample = drawExample
}
