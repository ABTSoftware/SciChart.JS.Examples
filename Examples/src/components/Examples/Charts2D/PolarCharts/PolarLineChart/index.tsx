import { makeStyles } from "tss-react/mui";
import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// Styles for the 3x3 grid
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
export default function LineChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    const { classes } = useStyles();
    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact initChart={chartsInitializationAPI.line1} />
                <SciChartReact initChart={chartsInitializationAPI.line2} />
                <SciChartReact initChart={chartsInitializationAPI.line3} />
                <SciChartReact initChart={chartsInitializationAPI.line4} />
                <SciChartReact initChart={chartsInitializationAPI.line5} />
                <SciChartReact initChart={chartsInitializationAPI.line6} />
            </div>
        </ChartGroupLoader>
    );
}
