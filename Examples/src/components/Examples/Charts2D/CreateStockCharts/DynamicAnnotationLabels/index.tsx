import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function DynamicAnnotationLabels() {
    return <SciChartReact initChart={drawExample} className="sc-chart-wrapper" />;
}
