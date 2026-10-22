import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { SciChart3DSurface } from "scichart";

export default function RealtimeSurfaceMesh3DChart() {
    return (
        <div className="sc-chart-wrapper">
            <SciChartReact<SciChart3DSurface, TResolvedReturnType<typeof drawExample>>
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { controls } = initResult;
                    controls.startUpdate();

                    // Return a cleanup function
                    return () => {
                        controls.stopUpdate();
                    };
                }}
                className="absolute w-full h-full"
            />
        </div>
    );
}
