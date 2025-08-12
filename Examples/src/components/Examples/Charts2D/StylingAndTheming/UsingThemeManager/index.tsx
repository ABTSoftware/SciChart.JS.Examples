import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// Styles for the 2x2 grid
const styles = {
    flexOuterContainer: {
        width: "100%",
        height: "100%",
    },
    item: {
        flex: "auto",
        flexBasis: "50%",
        minWidth: "200px",
    },
};

export default function ChartComponent() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className={commonClasses.ChartWrapper}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}
        >
            <SciChartReact style={styles.item} initChart={chartsInitializationAPI.createNavyThemeChart} />
            <SciChartReact style={styles.item} initChart={chartsInitializationAPI.createLightThemeChart} />
            <SciChartReact style={styles.item} initChart={chartsInitializationAPI.createDarkThemeChart} />
            <SciChartReact style={styles.item} initChart={chartsInitializationAPI.createCustomThemeChart} />
        </ChartGroupLoader>
    );
}
