import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";
import customPointImage from "./img/CustomMarkerImage.png";

export default function ChartComponent() {
    return <SciChartReact initChart={drawExample(customPointImage)} className="sc-chart-wrapper" />;
}
