import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, ChartGroupLoader } from "scichart-react";

export default function TenorCurves3DChart() {
    return (
        <ChartGroupLoader className="sc-chart-wrapper flex flex-wrap">
            <div className="relative" style={{ minWidth: 200, flex: "1 1 50%" }}>
                <SciChartReact initChart={draw3DChart} className="w-full h-full" />
                <SciChartReact initChart={drawHeatmapLegend} className="sc-color-legend" />
            </div>

            <div className="relative" style={{ flex: "1 1 50%" }}>
                <SciChartReact initChart={drawLineChart1} className="relative" style={{ height: "50%" }} />
                <SciChartReact initChart={drawLineChart2} style={{ height: "50%" }} />
            </div>
        </ChartGroupLoader>
    );
}
