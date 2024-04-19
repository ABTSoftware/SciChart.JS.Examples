import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "scichart-angular-app";

    public initJustLineCharts;
    public initDigitalLineCharts;
    public initTooltipsOnLineCharts;
    public initDashedLineCharts;
    public initPalettedLineCharts;
    public initHoveredLineCharts;
    public initGapsInLineCharts;
    public initVerticalLineCharts;
    public initThresholdedLineCharts;

    ngOnInit(): void {
        const chartInitializationPromise = drawExample(true).then(({ charts }) => {
            // @ts-ignore
            this.initJustLineCharts = charts.initJustLineCharts;
            // @ts-ignore
            this.initDigitalLineCharts = charts.initDigitalLineCharts;
            // @ts-ignore
            this.initTooltipsOnLineCharts = charts.initTooltipsOnLineCharts;
            // @ts-ignore
            this.initDashedLineCharts = charts.initDashedLineCharts;
            // @ts-ignore
            this.initPalettedLineCharts = charts.initPalettedLineCharts;
            // @ts-ignore
            this.initHoveredLineCharts = charts.initHoveredLineCharts;
            // @ts-ignore
            this.initGapsInLineCharts = charts.initGapsInLineCharts;
            // @ts-ignore
            this.initVerticalLineCharts = charts.initVerticalLineCharts;
            // @ts-ignore
            this.initThresholdedLineCharts = charts.initThresholdedLineCharts;
        });
    }
}
