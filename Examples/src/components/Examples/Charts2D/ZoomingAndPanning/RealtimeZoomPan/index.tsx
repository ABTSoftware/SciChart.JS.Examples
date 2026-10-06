import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <SciChartReact
            initChart={drawExample}
            className="sc-chart-wrapper"
            onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.startUpdate();
            }}
            onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                initResult.controls.stopUpdate();
            }}
        />
    );
}
