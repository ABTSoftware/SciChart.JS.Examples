import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { SciChart3DSurface } from "scichart";

// REACT COMPONENT
export default function RealtimeSurfaceMesh3DChart() {
    return (
        <div className={commonClasses.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <SciChartReact<SciChart3DSurface, TResolvedReturnType<typeof drawExample>>
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { controls } = initResult;
                        controls.startAnimation();

                        // Return a cleanup function
                        return () => {
                            controls.stopAnimation();
                        };
                    }}
                    style={{ position: "absolute", height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
}
