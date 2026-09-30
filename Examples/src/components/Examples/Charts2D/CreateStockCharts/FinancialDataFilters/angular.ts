import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { SciChartSurface } from "scichart";

import { drawExample, TFilterMode } from "./drawExample";

type TChartApi = Awaited<ReturnType<typeof drawExample>>;

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-financial-data-filters",
    template: `
        <div style="position: relative; width: 100%; height: 100%;">
            <div style="position: absolute; z-index: 1; top: 10px; left: 12px;">
                <button (click)="setFilterMode('source')" class="sc-button">No Filter</button>
                <button (click)="setFilterMode('heikinAshi')" class="sc-button">Heikin-Ashi</button>
                <button (click)="setFilterMode('renko')" class="sc-button">Renko</button>
                <button (click)="setFilterMode('pointAndFigure')" class="sc-button">Point & Figure</button>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="width: 100%; height: 100%;">
            </scichart-angular>
        </div>
    `,
})
export class AppComponent {
    drawExample = drawExample;
    chartApi?: TChartApi;
    filterMode: TFilterMode = "source";

    onInit(initResult: { sciChartSurface: SciChartSurface } & Partial<TChartApi>) {
        this.chartApi = initResult as TChartApi;
        this.chartApi.setFilterMode(this.filterMode);
    }

    setFilterMode(filterMode: TFilterMode) {
        this.filterMode = filterMode;
        this.chartApi?.setFilterMode(filterMode);
    }
}
