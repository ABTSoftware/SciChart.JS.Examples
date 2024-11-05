import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return (
        <SciChartReact
            initChart={drawExample}
            className={commonClasses.ChartWrapper}
            onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.stopAnimation();
            }}
        />
    );
}
