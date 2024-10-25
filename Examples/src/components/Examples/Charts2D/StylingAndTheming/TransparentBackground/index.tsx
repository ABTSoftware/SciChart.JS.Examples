import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import BackgroundImage from "./BackgroundGradient.jpg";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function TransparentBackground() {
    return (
        <div
            className={classes.ChartWrapper}
            style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: "100% 100%" }}
        >
            <SciChartReact initChart={drawExample} />
        </div>
    );
}
