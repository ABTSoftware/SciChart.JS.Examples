import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export default function ContourChart() {
    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <SciChartReact initChart={drawExample} className="w-full h-full" />
            <SciChartReact
                initChart={drawHeatmapLegend}
                className="sc-color-legend"
            />
        </ChartGroupLoader>
    );
}
