import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExample";
import { SciChartReact } from "scichart-react";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

export default function TenorCurves3DChart() {
    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper} style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ flex: "auto", flexBasis: "50%", position: "relative", minWidth: "200px" }}>
                <SciChartReact initChart={draw3DChart} style={{ width: "100%", height: "100%" }} />
                <SciChartReact
                    initChart={drawHeatmapLegend}
                    style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        width: "65px",
                        right: "0",
                    }}
                />
            </div>

            <div style={{ flex: "auto", position: "relative", flexBasis: "50%" }}>
                <SciChartReact initChart={drawLineChart1} style={{ position: "relative", height: "50%" }} />
                <SciChartReact initChart={drawLineChart2} style={{ height: "50%" }} />
            </div>
        </ChartGroupLoader>
    );
}
