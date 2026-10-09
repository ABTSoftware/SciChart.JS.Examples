import BackgroundImage from "./BackgroundGradient.jpg";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function TransparentBackground() {
    return (
        <SciChartReact
            className="sc-chart-wrapper"
            style={{ backgroundSize: "100% 100%", backgroundImage: `url(${BackgroundImage})` }}
            initChart={drawExample}
        />
    );
}
