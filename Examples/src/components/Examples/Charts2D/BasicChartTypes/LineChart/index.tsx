import { makeStyles } from "tss-react/mui";
import * as React from "react";
import { SciChartSurface } from "scichart";
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
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        justifyItems: "stretch",
        background: appTheme.Background,
    },
    flexContainerRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "33%",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        width: "calc(100% - 10px)",
    },
    item: {
        flex: "auto",
        flexBasis: "33%",
        minWidth: "200px",
        height: "auto",
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
                <SciChartReact initChart={chartsInitializationAPI.initJustLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initDigitalLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initTooltipsOnLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initDashedLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initPalettedLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initHoveredLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initGapsInLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initVerticalLineCharts} className={classes.item} />
                <SciChartReact initChart={chartsInitializationAPI.initThresholdedLineCharts} className={classes.item} />
            </div>
        </ChartGroupLoader>
    );
}
