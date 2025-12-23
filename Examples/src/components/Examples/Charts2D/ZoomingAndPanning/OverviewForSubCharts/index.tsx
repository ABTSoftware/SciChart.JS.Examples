import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function OverviewForSubCharts() {
    return <SciChartReact className={commonClasses.ChartWithNestedToolbar} initChart={drawExample}></SciChartReact>;
}
