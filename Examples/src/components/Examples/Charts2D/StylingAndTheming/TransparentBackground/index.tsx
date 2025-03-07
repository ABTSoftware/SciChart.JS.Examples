import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import BackgroundImage from "./BackgroundGradient.jpg";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function TransparentBackground() {
    return (
        <SciChartReact
            className={commonClasses.ChartWrapper}
            style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: "100% 100%" }}
            initChart={drawExample}
        />
    );
}
