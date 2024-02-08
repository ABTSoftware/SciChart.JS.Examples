import * as React from "react";
import { appTheme } from "scichart-example-dependencies";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return (
        <SciChartReact
            initChart={drawExample}
            className={classes.ChartWrapper}
            onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.handleStop();
            }}
        />
    );
}
