import { Component, OnDestroy } from "@angular/core";
import { SciChartSurface } from "scichart";
import { getChartsInitializationAPI } from "./drawExample";

@Component({
    selector: "app-multi-pane-stock-charts",
    template: `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <scichart-angular
                [initChart]="chartsInitializationAPI.drawPriceChart"
                (onInit)="onChartInit($event, 'price')"
                style="flex: 1; flex-basis: 50%;"
            >
            </scichart-angular>
            <scichart-angular
                [initChart]="chartsInitializationAPI.drawMacdChart"
                (onInit)="onChartInit($event, 'macd')"
                style="flex: 1; flex-basis: 50%;"
            >
            </scichart-angular>
            <scichart-angular
                [initChart]="chartsInitializationAPI.drawRsiChart"
                (onInit)="onChartInit($event, 'rsi')"
                style="flex: 1; flex-basis: 50%;"
            >
            </scichart-angular>
            <scichart-angular
                *ngIf="showOverviewChart"
                [initChart]="getOverviewChartInit()"
                (onInit)="onChartInit($event, 'overview')"
                style="flex: 1; flex-basis: 50%;"
            >
            </scichart-angular>
        </div>
    `,
})
export class AppComponent {
    chartsInitializationAPI = getChartsInitializationAPI();
    mainChart?: SciChartSurface;
    macdChart?: SciChartSurface;
    rsiChart?: SciChartSurface;
    overviewChart?: SciChartSurface;
    showOverviewChart = false;

    async onChartInit(
        initResult: Awaited<ReturnType<typeof this.chartsInitializationAPI.drawPriceChart>>,
        chartType: "price" | "macd" | "rsi" | "overview"
    ) {
        if (initResult?.sciChartSurface) {
            switch (chartType) {
                case "price":
                    this.mainChart = initResult.sciChartSurface;
                    break;
                case "macd":
                    this.macdChart = initResult.sciChartSurface;
                    break;
                case "rsi":
                    this.rsiChart = initResult.sciChartSurface;
                    break;
                case "overview":
                    this.overviewChart = initResult.sciChartSurface;
                    break;
            }

            if (this.mainChart && this.macdChart && this.rsiChart) {
                this.showOverviewChart = true;
                this.configureCharts();
            }
        } else {
            console.error("Chart not initialized!");
        }
    }

    getOverviewChartInit() {
        return this.chartsInitializationAPI.drawOverview(this.mainChart as SciChartSurface);
    }

    private configureCharts() {
        if (this.mainChart && this.macdChart && this.rsiChart) {
            this.chartsInitializationAPI.configureAfterInit();
        }
    }
}
