import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

export default function ChartComponent() {
    return (
        <div className={classes.ChartWrapper}>
            <SciChartReact style={{ width: "100%", height: "100%", float: "left" }} initChart={drawExample} />
            {/*Placeholder until we have a proper chart title (soon!)*/}
            <span
                style={{
                    color: appTheme.ForegroundColor,
                    fontSize: 20,
                    position: "absolute",
                    left: "50%",
                    top: "20px",
                    transform: "translate(-50%)",
                }}
            >
                Market share of Internet Browsers (2022)
            </span>
        </div>
    );
}
