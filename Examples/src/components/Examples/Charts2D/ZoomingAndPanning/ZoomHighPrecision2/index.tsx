import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import Button from "@material-ui/core/Button";
import { useState, useEffect, useRef } from "react";
import { SciChartSurface, EYRangeMode } from "scichart";
import { TResolvedReturnType } from "scichart-react";

const divID = "scichart-root";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();
    const sciChartSurfaceRef = useRef<SciChartSurface>();

    const [isYRangeModeVisible, setIsYRangeModeVisible] = useState(true);

    function handleZoomChange(shouldZoomIn: boolean) {
        if (sciChartSurfaceRef.current) {
            if (shouldZoomIn) {
                controlsRef.current.ZoomInRandomly();
            } else {
                controlsRef.current.ZoomOut();
            }
        }
    }

    useEffect(() => {
        const chartInitializationPromise = drawExample(divID).then(({ sciChartSurface, controls }) => {
            sciChartSurfaceRef.current = sciChartSurface;
            controlsRef.current = controls;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
            });
        };
    }, []);

    function handleVisibleChanged(visible: boolean) {
        sciChartSurfaceRef.current.renderableSeries.get(0).yRangeMode = visible
            ? EYRangeMode.Visible
            : EYRangeMode.Drawn;
        setIsYRangeModeVisible(visible);
    }

    return (
        <div>
            <h4>Nanoseconds since midnight</h4>
            <p>2 weeks range with nanosecond precsion</p>
            <div className={classes.ButtonsWrapper} style={{ marginBottom: 10 }}>
                <Button onClick={() => handleZoomChange(true)}>Zoom in on random point</Button>
                <Button onClick={() => handleZoomChange(false)}>Zoom out</Button>
                <Button style={{ marginLeft: "auto" }} onClick={() => handleVisibleChanged(!isYRangeModeVisible)}>
                    Y Range Mode: {isYRangeModeVisible ? "Visible" : "Drawn"}
                </Button>
            </div>
            {/*The chart will be located here*/}
            <div style={{ flex: "auto" }}>
                <div id={divID} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
}
