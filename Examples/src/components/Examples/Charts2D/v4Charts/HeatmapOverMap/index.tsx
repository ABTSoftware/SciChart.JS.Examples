import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export default function ContourChart() {
    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <SciChartReact initChart={drawExample} className="h-full" style={{ width: "calc(100% - 60px)" }} />
            <SciChartReact
                initChart={drawHeatmapLegend}
                className="absolute h-full"
                style={{ width: 65, top: 0, right: 0, backgroundColor: "#000000dd" }}
            />
        </ChartGroupLoader>
    );
}
