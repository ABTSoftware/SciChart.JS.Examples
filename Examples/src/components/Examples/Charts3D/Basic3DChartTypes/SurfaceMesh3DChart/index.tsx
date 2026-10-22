import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, ChartGroupLoader } from "scichart-react";

export default function SurfaceMesh3DChart() {
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
