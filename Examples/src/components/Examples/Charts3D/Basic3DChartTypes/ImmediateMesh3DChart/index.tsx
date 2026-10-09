import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ImmediateMesh3DChart() {
    return <SciChartReact initChart={drawExample} className="sc-chart-wrapper" />;
}
