import { SciChartReact } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export default function ChartComponent() {
    return (
        <div
            className="relative w-full h-full"
        >
            <SciChartReact initChart={drawExample} className="sc-chart-wrapper" />;
            <SciChartReact
                initChart={drawHeatmapLegend}
                className="sc-color-legend"
            />
        </div>
    );
}
