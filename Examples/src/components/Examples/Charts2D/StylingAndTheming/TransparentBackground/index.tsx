import * as React from "react";
import BackgroundImage from "./BackgroundGradient.jpg";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function TransparentBackground() {
    return (
        <SciChartReact
            className="sc-chart-wrapper"
            style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: "100% 100%" }}
            initChart={drawExample}
        />
    );
}
