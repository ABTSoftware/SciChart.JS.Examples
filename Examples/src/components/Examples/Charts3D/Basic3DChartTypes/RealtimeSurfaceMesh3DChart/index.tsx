import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { SciChart3DSurface } from "scichart";

// REACT COMPONENT
export default function RealtimeSurfaceMesh3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();
    const animationRef = React.useRef<any>();

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <SciChartReact
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface, controls } = initResult;
                        sciChartSurfaceRef.current = sciChartSurface;
                        animationRef.current = controls;
                        controls.startAnimation();

                        // Return a cleanup function
                        return () => {
                            if (controls) {
                                controls.stopAnimation();
                            }
                        };
                    }}
                    style={{ position: "absolute", height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
}
