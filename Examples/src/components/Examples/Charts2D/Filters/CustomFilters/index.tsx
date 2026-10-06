import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function ChartComponent() {
    return (
        <div className="sc-chart-wrapper">
            <SciChartReact
                className="w-full h-full"
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.startUpdate();
                }}
                onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.stopUpdate();
                }}
            />
        </div>
    );
}
