import * as React from "react";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <div className={classes.ChartWrapper}>
            <SciChartReact
                style={{ width: "100%", height: "100%", float: "left" }}
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.startDemo();
                }}
                onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.stopDemo();
                }}
            />
        </div>
    );
}
