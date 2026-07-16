import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";
import { SciChartSurface } from "scichart";
import { getChartsInitializationAPI } from "./drawExample";

type TChartType = "main" | "left" | "right";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent],
    selector: "app-interactive-3d-waterfall-spectral-chart",
    template: `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="flex: 1; flex-basis: 60%; min-height: 0;">
                <scichart-angular [initChart]="chartsInitializationAPI.initMainChart3D" (onInit)="onChartInit($event, 'main')" style="width: 100%; height: 100%;">
                </scichart-angular>
            </div>
            <div style="display: flex; flex: 1; flex-basis: 40%; min-height: 0;">
                <scichart-angular [initChart]="chartsInitializationAPI.initCrossSectionLeft" (onInit)="onChartInit($event, 'left')" style="flex: 1; min-width: 0; height: 100%;">
                </scichart-angular>
                <scichart-angular [initChart]="chartsInitializationAPI.initCrossSectionRight" (onInit)="onChartInit($event, 'right')" style="flex: 1; min-width: 0; height: 100%;">
                </scichart-angular>
            </div>
        </div>
    `,
})
export class AppComponent {
    chartsInitializationAPI = getChartsInitializationAPI();
    mainChart?: SciChartSurface;
    crossSectionLeft?: SciChartSurface;
    crossSectionRight?: SciChartSurface;

    onChartInit(initResult: { sciChartSurface?: SciChartSurface } | undefined, chartType: TChartType) {
        if (!initResult?.sciChartSurface) {
            return;
        }

        switch (chartType) {
            case "main":
                this.mainChart = initResult.sciChartSurface;
                break;
            case "left":
                this.crossSectionLeft = initResult.sciChartSurface;
                break;
            case "right":
                this.crossSectionRight = initResult.sciChartSurface;
                break;
        }

        if (this.mainChart && this.crossSectionLeft && this.crossSectionRight) {
            this.chartsInitializationAPI.configureAfterInit();
        }
    }
}
