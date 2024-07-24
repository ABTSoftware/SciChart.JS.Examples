import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
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

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.flexContainerRow}>
                    <SciChartReact
                        className={localClasses.item}
                        initChart={chartsInitializationAPI.createNavyThemeChart}
                    />
                    <SciChartReact
                        className={localClasses.item}
                        initChart={chartsInitializationAPI.createLightThemeChart}
                    />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <SciChartReact
                        className={localClasses.item}
                        initChart={chartsInitializationAPI.createDarkThemeChart}
                    />
                    <SciChartReact
                        className={localClasses.item}
                        initChart={chartsInitializationAPI.createCustomThemeChart}
                    />
                </div>
            </div>
        </div>
    );
}
