import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, ChartGroupLoader } from "scichart-react";

export default function PointLine3DChart() {
    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <SciChartReact className="w-full h-full" initChart={drawExample} />
            <SciChartReact
                className="sc-color-legend"
                initChart={drawHeatmapLegend}
            />
        </ChartGroupLoader>
    );
}
