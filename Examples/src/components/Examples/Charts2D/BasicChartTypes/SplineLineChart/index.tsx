import * as React from "react";
import { SciChartReact } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return <SciChartReact initChart={drawExample} className={classes.ChartWrapper} />;
}
