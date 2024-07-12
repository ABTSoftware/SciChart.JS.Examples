import classes from "../../../styles/Examples.module.scss";
import { SciChartReact } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export default function ContourChart() {
    return (
        <div className={classes.ChartWrapper}>
            <SciChartReact initChart={drawExample} style={{ width: "100%", height: "100%" }} />
            <SciChartReact
                initChart={drawHeatmapLegend}
                style={{ position: "absolute", height: "92%", width: "100px", top: 0, right: "70px", margin: "20px" }}
            />
        </div>
    );
}
