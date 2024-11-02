import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExaple";
import { SciChartReact } from "scichart-react";

export default function TenorCurves3DChart() {
    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper} style={{ display: "flex" }}>
                <div style={{ flex: "none", width: "50%", position: "relative" }}>
                    <SciChartReact initChart={draw3DChart} style={{ width: "100%", height: "100%" }} />
                    <SciChartReact
                        initChart={drawHeatmapLegend}
                        style={{
                            position: "absolute",
                            top: 0,
                            height: "95%",
                            width: "100px",
                            right: "0",
                            margin: "20",
                        }}
                    />
                </div>
                <div style={{ position: "relative", width: "50%", height: "100%" }}>
                    <SciChartReact initChart={drawLineChart1} style={{ position: "relative", height: "50%" }} />
                    <SciChartReact initChart={drawLineChart2} style={{ height: "50%" }} />
                </div>
            </div>
        </React.Fragment>
    );
}
