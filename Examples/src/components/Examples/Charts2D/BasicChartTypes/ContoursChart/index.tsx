import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export default function ContourChart() {
    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <SciChartReact initChart={drawExample} style={{ width: "100%", height: "100%" }} />
            <SciChartReact
                initChart={drawHeatmapLegend}
                style={{ position: "absolute", height: "100%", width: "65px", top: 0, right: 0 }}
            />
        </ChartGroupLoader>
    );
}
