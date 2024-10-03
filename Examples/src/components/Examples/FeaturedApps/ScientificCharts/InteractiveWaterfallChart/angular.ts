import { Component, OnInit, AfterViewInit } from "@angular/core";
import { getChartsInitializationAPI } from "./drawExample";
import { SciChartSurface } from "scichart";

@Component({
    selector: "app-interactive-waterfall-chart",
    template: `
        <style>
            .chart-wrapper {
                width: 100%;
                height: 100%;
                background: #2d2d2d;
            }
        </style>
        <div style="background: #2d2d2d;" class="chart-wrapper">
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #1e1e1e;">
                <scichart-angular
                    [initChart]="chartsInitializationAPI.initMainChart"
                    (onInit)="onInit($event, 'main')"
                    style="flex: 1; flex-basis: 50%;"
                >
                </scichart-angular>
                <div style="display: flex; flex: 1; flex-basis: 50%;">
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initCrossSectionLeft"
                        (onInit)="onInit($event, 'leftSection')"
                        style="flex: 1;"
                    >
                    </scichart-angular>
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initCrossSectionRight"
                        (onInit)="onInit($event, 'rightSection')"
                        style="flex: 1;"
                    >
                    </scichart-angular>
                </div>
            </div>
        </div>
    `,
})
export class AppComponent {
    chartsInitializationAPI = getChartsInitializationAPI();
    mainSurface?: SciChartSurface;
    leftSectionSurface?: SciChartSurface;
    rightSectionSurface?: SciChartSurface;

    async onInit(initResult: { sciChartSurface: SciChartSurface }, chart: "main" | "leftSection" | "rightSection") {
        switch (chart) {
            case "main":
                this.mainSurface = initResult.sciChartSurface;
                break;
            case "leftSection":
                this.leftSectionSurface = initResult.sciChartSurface;
                break;
            case "rightSection":
                this.rightSectionSurface = initResult.sciChartSurface;
                break;
        }
        if (this.mainSurface && this.leftSectionSurface && this.rightSectionSurface) {
            this.chartsInitializationAPI.configureAfterInit();
        }
    }
}
