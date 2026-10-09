import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function FeatureAxisTypes() {
    return <SciChartReact className="sc-chart-wrapper" initChart={drawExample} />;
}
