import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import {
    SciChartSurface,
} from "scichart";
import { appTheme, ExampleDataProvider, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import {
    drawExample,
    divElementId2,
    divElementId3,
    divElementId4,
    divElementId1,
    divElementId5,
    divElementId6,
    divElementId7,
    divElementId8,
    divElementId9
} from "./drawExample";

// Styles for the 3x3 grid
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: appTheme.DarkIndigo
    },
    flexContainerRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "33%",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        width: "calc(100% - 10px)"
    },
    item: {
        flex: "auto",
        height: "100%"
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface[]>();

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ charts }) => {
            sciChartSurfaceRef.current = charts;
        });

        // Deleting sciChartSurface to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.forEach(sciChartSurface => sciChartSurface.delete());
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.forEach(sciChartSurface => sciChartSurface.delete());
            });
        };
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper} style={{ aspectRatio: "3 / 2" }}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId1} className={localClasses.item} />
                    <div id={divElementId2} className={localClasses.item} />
                    <div id={divElementId3} className={localClasses.item} />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId4} className={localClasses.item} />
                    <div id={divElementId5} className={localClasses.item} />
                    <div id={divElementId6} className={localClasses.item} />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId7} className={localClasses.item} />
                    <div id={divElementId8} className={localClasses.item} />
                    <div id={divElementId9} className={localClasses.item} />
                </div>
            </div>
        </div>
    );
}
