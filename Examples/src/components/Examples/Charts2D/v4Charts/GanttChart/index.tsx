import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <SciChartReact 
            initChart={drawExample}
            className="sc-chart-wrapper"
        />
    );
}
