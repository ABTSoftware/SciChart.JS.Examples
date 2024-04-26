import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { getChartsInitializationAPI } from "./drawExample";

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
        const charts = getChartsInitializationAPI();
        this.initJustLineCharts = charts.initJustLineCharts;
        this.initDigitalLineCharts = charts.initDigitalLineCharts;
        this.initTooltipsOnLineCharts = charts.initTooltipsOnLineCharts;
        this.initDashedLineCharts = charts.initDashedLineCharts;
        this.initPalettedLineCharts = charts.initPalettedLineCharts;
        this.initHoveredLineCharts = charts.initHoveredLineCharts;
        this.initGapsInLineCharts = charts.initGapsInLineCharts;
        this.initVerticalLineCharts = charts.initVerticalLineCharts;
        this.initThresholdedLineCharts = charts.initThresholdedLineCharts;
    }
}
