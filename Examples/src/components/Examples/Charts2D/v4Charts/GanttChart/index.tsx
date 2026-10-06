import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <div className="sc-chart-wrapper">
            <div
                className="w-full h-full flex flex-col"
            >
                <SciChartReact initChart={drawExample} className="flex-1" />
            </div>
        </div>
    );
}
