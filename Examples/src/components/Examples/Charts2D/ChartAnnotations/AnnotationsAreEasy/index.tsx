import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";
import CustomImage from "./scichart-logo-white.png";

export default function ChartComponent() {
    return <SciChartReact initChart={drawExample(CustomImage)} className="sc-chart-wrapper" />;
}
