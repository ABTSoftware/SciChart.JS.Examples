import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawExample2 } from "./drawExample";
import Button from "@material-ui/core/Button";
import { useState, useEffect, useRef } from "react";
import { EYRangeMode, SciChartSurface } from "scichart";
import { TResolvedReturnType } from "scichart-react";

const divID = "scichart-root";
const divID2 = "scichart-root2";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();
    const sciChartSurfaceRef = useRef<SciChartSurface>();
    const sciChartSurfaceRef2 = useRef<SciChartSurface>();

    const [startingRange, setStartingRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
    const [isYRangeModeVisible, setIsYRangeModeVisible] = useState(true);

    function handleZoomChange(shouldZoomIn: boolean) {
        if (sciChartSurfaceRef.current) {
            const xAxis = sciChartSurfaceRef.current.xAxes.get(0);

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

            setStartingRange({
                min: sciChartSurface.xAxes.get(0).visibleRange.min,
                max: sciChartSurface.xAxes.get(0).visibleRange.max,
            });
        });

        const chartInitializationPromise2 = drawExample2(divID2).then(({ sciChartSurface }) => {
            sciChartSurfaceRef2.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current && sciChartSurfaceRef2.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;

                sciChartSurfaceRef2.current.delete();
                sciChartSurfaceRef2.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
            });

            chartInitializationPromise2.then(() => {
                sciChartSurfaceRef2.current.delete();
                sciChartSurfaceRef2.current = undefined;
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
            <h4>Unix Timestamps</h4>
            <p>300 year data range with 1ms precision</p>
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

            <h4>Seconds since midnight</h4>
            <p>2 weeks range with nanosecond precsion</p>
            {/*The chart will be located here*/}
            <div style={{ flex: "auto" }}>
                <div id={divID2} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
}
