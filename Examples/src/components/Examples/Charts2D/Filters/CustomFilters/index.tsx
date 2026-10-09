import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <SciChartReact
            className="sc-chart-wrapper"
            initChart={drawExample}
            onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.startUpdate();
            }}
            onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.stopUpdate();
            }}
        />
    );
}
