import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <div className="sc-chart-wrapper">
            <SciChartReact className="w-full h-full" initChart={drawExample} />
            <h2 className="sc-chart-title">
                Market share of Internet Browsers (2022)
            </h2>
        </div>
    );
}
