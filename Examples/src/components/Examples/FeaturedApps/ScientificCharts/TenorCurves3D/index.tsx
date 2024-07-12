import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExaple";
import { SciChartReact } from "scichart-react";

export default function TenorCurves3DChart() {
    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div style={{ float: "left", width: "50%", height: "100%", position: "relative" }}>
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
                <div style={{ position: "relative", left: "50%", width: "50%", height: "100%" }}>
                    <SciChartReact initChart={drawLineChart1} style={{ position: "relative", height: "50%" }} />
                    <SciChartReact initChart={drawLineChart2} style={{ height: "50%" }} />
                </div>
            </div>
        </React.Fragment>
    );
}
