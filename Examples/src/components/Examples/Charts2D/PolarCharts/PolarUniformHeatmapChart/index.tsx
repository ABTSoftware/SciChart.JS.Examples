import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        >
            <SciChartReact initChart={drawExample} className={commonClasses.ChartWrapper} />
            <SciChartReact
                initChart={drawHeatmapLegend}
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "65px",
                    top: "0px",
                    right: "0px",
                }}
            />
        </div>
    );
}
