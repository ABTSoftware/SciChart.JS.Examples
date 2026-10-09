import { SciChartReact, SciChartNestedOverview } from "scichart-react";
import { drawExample, drawHeatmapLegend, sciChartOverview } from "./drawExample";

export default function OrderBookHeatmap() {
    return (
        <div className="sc-chart-wrapper flex flex-col">
            <SciChartReact
                className="flex flex-col w-full flex-auto"
                initChart={drawExample}
                innerContainerProps={{ style: { flex: "1 1 90%", minHeight: 0 } }}
            >
                <SciChartNestedOverview style={{ flex: "1 1 10%" }} options={sciChartOverview} />
            </SciChartReact>
            <SciChartReact
                initChart={drawHeatmapLegend}
                className="absolute top-0 left-0"
                style={{ height: "90%", width: 65 }}
            />
        </div>
    );
}
