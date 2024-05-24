import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawExample2 } from "./drawExample";
import Button from "@material-ui/core/Button";
import { useState, useEffect, useRef } from "react";
import { SciChartSurface, NumberRange, easing } from "scichart";

const divID = "scichart-root";
const divID2 = "scichart-root2";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const sciChartSurfaceRef = useRef<SciChartSurface>();
    const sciChartSurfaceRef2 = useRef<SciChartSurface>();

    const [ startingRange, setStartingRange ] = useState<{min: number, max: number}>({min: 0, max: 100});

    function handleZoomChange(shouldZoomIn: boolean) {
        if (sciChartSurfaceRef.current) {
            const xAxis = sciChartSurfaceRef.current.xAxes.get(0);
            
            if (shouldZoomIn) {
                xAxis.animateVisibleRange(
                    new NumberRange(
                        6596553507.41382,
                        6596553528.236896
                    ), 
                    1500, // duration
                    easing.outCirc
                );
            } else {
                xAxis.animateVisibleRange(
                    new NumberRange(
                        startingRange.min,
                        startingRange.max
                    ), 
                    1500, // duration
                    easing.outCirc
                );
            }
        }
    }

    setInterval(() => {
        console.log(sciChartSurfaceRef.current?.xAxes.get(0).visibleRange);
    }, 3000);

    useEffect(() => {
        const chartInitializationPromise = drawExample(divID).then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
            
            setStartingRange({
                min: sciChartSurface.xAxes.get(0).visibleRange.min,
                max: sciChartSurface.xAxes.get(0).visibleRange.max
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
    return (
        <div>
            <h4>Unix Timestamps</h4>
            <p>300 year data range with 1ms precision</p>
            <div className={classes.ButtonsWrapper} style={{marginBottom: 10}}>
                <Button onClick={() => 
                    handleZoomChange(true)
                }>
                    Zoom in
                </Button>
                <Button onClick={() => 
                    handleZoomChange(false)
                }>
                    Zoom out
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
