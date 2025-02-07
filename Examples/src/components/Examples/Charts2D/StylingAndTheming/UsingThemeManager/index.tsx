import { makeStyles } from "tss-react/mui";
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

// Styles for the 2x2 grid
const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        background: appTheme.Background,
    },
    item: {
        flex: "auto",
        flexBasis: "50%",
        minWidth: "200px",
    },
}));

export default function ChartComponent() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    const { classes } = useStyles();

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createNavyThemeChart} />
                <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createLightThemeChart} />
                <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createDarkThemeChart} />
                <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createCustomThemeChart} />
            </div>
        </ChartGroupLoader>
    );
}
