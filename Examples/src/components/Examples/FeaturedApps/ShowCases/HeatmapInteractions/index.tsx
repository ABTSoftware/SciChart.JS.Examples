import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, divElementId, divCrossSection, divInput, divHistory } from "./drawExample";

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
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

export default function HeatmapInteractions() {
    const localClasses = useStyles();
    const surfacesRef = React.useRef<SciChartSurface[]>([]);

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then((charts) => {
            surfacesRef.current = charts;
        });

        return () => {
            // check if chart is already initialized
            if (surfacesRef.current) {
                surfacesRef.current.forEach((surface) => surface.delete());
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                surfacesRef.current.forEach((surface) => surface.delete());
            });
        };
    }, []);

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button id="startAnimation" style={{ color: appTheme.ForegroundColor }}>
                            Start
                        </Button>
                        <Button id="stopAnimation" style={{ color: appTheme.ForegroundColor }}>
                            Stop
                        </Button>
                        <Button id="twoSource" style={{ color: appTheme.ForegroundColor }}>
                            Load basic example
                        </Button>
                        <Button id="interference" style={{ color: appTheme.ForegroundColor }}>
                            Load double slit example
                        </Button>
                        <Button id="showHelp" style={{ color: appTheme.ForegroundColor }}>
                            Show Help
                        </Button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", flexBasis: 500 }}>
                        <div id={divElementId} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }} />
                        <div id={divCrossSection} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", flexBasis: 500 }}>
                        <div id={divInput} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }} />
                        <div id={divHistory} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
