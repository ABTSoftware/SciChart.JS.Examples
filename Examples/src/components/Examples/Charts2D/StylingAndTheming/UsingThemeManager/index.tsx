import { makeStyles } from "@mui/styles";
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";

// Styles for the 2x2 grid
const useStyles = makeStyles((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: appTheme.Background,
    },
    flexContainerRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "50%",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        width: "calc(100% - 10px)",
    },
    item: {
        flex: "auto",
        height: "100%",
        marginRight: 10,
    },
}));

export default function ChartComponent() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI());

    const classes = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <div className={classes.flexContainerRow}>
                    <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createNavyThemeChart} />
                    <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createLightThemeChart} />
                </div>
                <div className={classes.flexContainerRow}>
                    <SciChartReact className={classes.item} initChart={chartsInitializationAPI.createDarkThemeChart} />
                    <SciChartReact
                        className={classes.item}
                        initChart={chartsInitializationAPI.createCustomThemeChart}
                    />
                </div>
            </div>
        </div>
    );
}
