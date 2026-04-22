import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function EyeDiagramChart() {
    return (
        <div className={commonClasses.ChartWrapper}>
            <SciChartReact
                style={{ width: "100%", height: "100%" }}
                initChart={(rootElementId: string | HTMLDivElement) => drawExample(rootElementId)}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.startAnimation();
                }}
                onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.cleanup();
                }}
            />
        </div>
    );
}
