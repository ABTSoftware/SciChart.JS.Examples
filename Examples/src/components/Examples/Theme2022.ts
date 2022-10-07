import { SciChartJSDarkv2Theme } from "scichart/Charting/Themes/SciChartJSDarkv2Theme";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";

export class SciChartJS2022Theme extends SciChartJSDarkv2Theme {
    public type = EThemeProviderType.DarkV2;

    constructor() {
        super();
        this.sciChartBackground = "radial-gradient(circle, #21253D 0%, #09090F 100%)";
        this.axisBandsFill = "#52469503";
        this.majorGridLineBrush = "#2B2D7077";
        this.minorGridLineBrush = "#191C6D77";
        this.tickTextBrush = "#E0FDFF";
    }
}