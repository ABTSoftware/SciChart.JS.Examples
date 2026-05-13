import * as React from "react";
import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function DynamicAnnotationLabels() {
    return <SciChartReact initChart={drawExample} className={commonClasses.ChartWrapper} />;
}
