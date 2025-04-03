import { makeStyles } from "tss-react/mui";
import * as React from "react";
import { SciChartSurface } from "scichart";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

// Styles for the 2x3 grid
const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "5px",
        padding: "5px",
        background: appTheme.DarkIndigo,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function GaugeChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    const { classes } = useStyles();

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact initChart={chartsInitializationAPI.gauge1} />
                <SciChartReact initChart={chartsInitializationAPI.gauge2} />
                <SciChartReact initChart={chartsInitializationAPI.gauge3} />
                <SciChartReact initChart={chartsInitializationAPI.gauge4} />
                <SciChartReact initChart={chartsInitializationAPI.gauge5} />
                <SciChartReact initChart={chartsInitializationAPI.gauge6} />
            </div>
        </ChartGroupLoader>
    );
}
