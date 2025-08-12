import * as React from "react";
import { SciChartSurface } from "scichart";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";
import { CSSProperties } from "react";

// Styles for the 3x3 grid
const styles: Record<string, CSSProperties> = {
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        justifyItems: "stretch",
        background: appTheme.Background,
    },
    item: {
        flex: "auto",
        flexBasis: "33%",
        minWidth: "200px",
        height: "auto",
    },
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper} style={styles.flexOuterContainer}>
            <SciChartReact initChart={chartsInitializationAPI.initJustLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initDigitalLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initTooltipsOnLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initDashedLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initPalettedLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initHoveredLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initGapsInLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initVerticalLineCharts} style={styles.item} />
            <SciChartReact initChart={chartsInitializationAPI.initThresholdedLineCharts} style={styles.item} />
        </ChartGroupLoader>
    );
}
