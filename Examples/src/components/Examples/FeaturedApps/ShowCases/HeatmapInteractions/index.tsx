import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { SciChartSurface } from "scichart";
import {appTheme} from "scichart-example-dependencies";
import classes from "scichart-example-dependencies/styles/Examples.module.scss";
import { drawExample, divElementId, divCrossSection, divInput, divHistory } from "./drawExample";

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
    }
}));

let scs: SciChartSurface;

export default function HeatmapInteractions () {
    const localClasses = useStyles();
    const surfacesRef = React.useRef<SciChartSurface[]>([]);

    React.useEffect(() => {
        drawExample().then(charts => {
            charts.forEach(sciChartSurface => {
                surfacesRef.current.push(sciChartSurface);
            });
        });
    }, []);

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button id="startAnimation" style={{color: appTheme.ForegroundColor}}>Start</Button>
                        <Button id="stopAnimation" style={{color: appTheme.ForegroundColor}}>Stop</Button>
                        <Button id="twoSource" style={{color: appTheme.ForegroundColor}}>Load basic example</Button>
                        <Button id="interference" style={{color: appTheme.ForegroundColor}}>Load double slit example</Button>
                        <Button id="showHelp" style={{color: appTheme.ForegroundColor}}>Show Help</Button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", flexBasis: 500 }}>
                        <div id={divElementId} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }} />
                        <div id={divCrossSection} style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1}} />
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
