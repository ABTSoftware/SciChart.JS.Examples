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
        <div class="sc-chart-wrapper">
            <div class="sc-toolbar-row">
                <div class="sc-button-group" role="group" aria-label="Data filter">
                    <button
                        type="button"
                        (click)="setFilterMode('source')"
                        [attr.aria-pressed]="filterMode === 'source'"
                        class="sc-button"
                    >
                        No filter
                    </button>
                    <button
                        type="button"
                        (click)="setFilterMode('heikinAshi')"
                        [attr.aria-pressed]="filterMode === 'heikinAshi'"
                        class="sc-button"
                    >
                        Heikin-Ashi
                    </button>
                    <button
                        type="button"
                        (click)="setFilterMode('renko')"
                        [attr.aria-pressed]="filterMode === 'renko'"
                        class="sc-button"
                    >
                        Renko
                    </button>
                    <button
                        type="button"
                        (click)="setFilterMode('pointAndFigure')"
                        [attr.aria-pressed]="filterMode === 'pointAndFigure'"
                        class="sc-button"
                    >
                        Point &amp; figure
                    </button>
                </div>
            </div>
            <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)"></scichart-angular>
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
