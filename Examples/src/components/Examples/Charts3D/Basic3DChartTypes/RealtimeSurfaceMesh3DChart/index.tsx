import * as React from "react";
import classes from "../../../styles/Examples.module.scss";

import { SciChart3DSurface } from "scichart";
import { drawExample, divElementId } from "./drawExample";

// REACT COMPONENT
export default function RealtimeSurfaceMesh3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();
    const controlsRef = React.useRef<{ startAnimation: () => void; stopAnimation: () => void }>();

    React.useEffect(() => {
        const chartPromise = drawExample().then((res) => {
            sciChartSurfaceRef.current = res.sciChart3DSurface;
            controlsRef.current = res.controls;
            res.controls.startAnimation();
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                controlsRef.current.stopAnimation();
                controlsRef.current = undefined;
            } else {
                chartPromise.then((res) => {
                    sciChartSurfaceRef.current.delete();
                    sciChartSurfaceRef.current = undefined;
                    controlsRef.current.stopAnimation();
                    controlsRef.current = undefined;
                });
            }
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <div id={divElementId} style={{ position: "absolute", height: "100%", width: "100%" }}></div>
            </div>
        </div>
    );
}
