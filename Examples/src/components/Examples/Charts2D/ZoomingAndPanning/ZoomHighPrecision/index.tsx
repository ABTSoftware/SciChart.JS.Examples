import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawExample2 } from "./drawExample";
import Button from "@material-ui/core/Button";
import { useState, useEffect, useRef } from "react";
import { EYRangeMode, SciChartSurface } from "scichart";
import { TResolvedReturnType } from "scichart-react";
import { makeStyles } from "@material-ui/core";
import { appTheme } from "../../../theme";

const divID = "scichart-root";
const divID2 = "scichart-root2";

const useStyles = makeStyles((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    item: {
        flex: "auto",
        height: "100%",
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();
    const controlsRef2 = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();
    const sciChartSurfaceRef = useRef<SciChartSurface>();
    const sciChartSurfaceRef2 = useRef<SciChartSurface>();

    const [isYRangeModeVisible, setIsYRangeModeVisible] = useState(true);

    function handleZoomChange(shouldZoomIn: boolean) {
        if (controlsRef.current) {
            if (shouldZoomIn) {
                controlsRef.current.ZoomInRandomly();
            } else {
                controlsRef.current.ZoomOut();
            }
        }
    }

    function handleZoomChange2(shouldZoomIn: boolean) {
        if (controlsRef2.current) {
            if (shouldZoomIn) {
                controlsRef2.current.ZoomInRandomly();
            } else {
                controlsRef2.current.ZoomOut();
            }
        }
    }

    useEffect(() => {
        const chartInitializationPromise = drawExample(divID).then(({ sciChartSurface, controls }) => {
            sciChartSurfaceRef.current = sciChartSurface;
            controlsRef.current = controls;
        });

        const chartInitializationPromise2 = drawExample2(divID2).then(({ sciChartSurface, controls }) => {
            sciChartSurfaceRef2.current = sciChartSurface;
            controlsRef2.current = controls;
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
        sciChartSurfaceRef2.current.renderableSeries.get(0).yRangeMode = visible
            ? EYRangeMode.Visible
            : EYRangeMode.Drawn;
        setIsYRangeModeVisible(visible);
    }

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div style={{ flex: "auto", flexBasis: "50%" }}>
                    <div className={localClasses.toolbarRow}>
                        <Button onClick={() => handleZoomChange(true)} style={{ color: appTheme.ForegroundColor }}>
                            Zoom in on random point
                        </Button>
                        <Button onClick={() => handleZoomChange(false)} style={{ color: appTheme.ForegroundColor }}>
                            Zoom out
                        </Button>
                        <Button
                            style={{ marginLeft: "auto", color: appTheme.ForegroundColor }}
                            onClick={() => handleVisibleChanged(!isYRangeModeVisible)}
                        >
                            Y Range Mode: {isYRangeModeVisible ? "Visible" : "Drawn"}
                        </Button>
                    </div>
                    <div id={divID} className={localClasses.item} style={{ height: "calc(100% - 57px)" }} />
                </div>
                <div style={{ flex: "auto", flexBasis: "50%" }}>
                    <div className={localClasses.toolbarRow}>
                        <Button onClick={() => handleZoomChange2(true)} style={{ color: appTheme.ForegroundColor }}>
                            Zoom in on random point
                        </Button>
                        <Button onClick={() => handleZoomChange2(false)} style={{ color: appTheme.ForegroundColor }}>
                            Zoom out
                        </Button>
                    </div>
                    <div id={divID2} className={localClasses.item} style={{ height: "calc(100% - 57px)" }} />
                </div>
            </div>
        </div>
    );
}
