import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";
import SciChartImage from "./scichart-logo-white.png";
export default function ChartComponent() {
    return <SciChartReact initChart={drawExample(SciChartImage)} className="sc-chart-wrapper" />;
}
