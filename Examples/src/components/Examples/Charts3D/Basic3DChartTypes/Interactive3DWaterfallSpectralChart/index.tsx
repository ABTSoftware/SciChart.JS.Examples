import * as React from "react";
import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { Typography } from "@mui/material";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";

export default function Interactive3DWaterfallSpectralChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <div
            className={commonClasses.ChartWrapper}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: appTheme.DarkIndigo,
            }}
        >
            <ChartGroupLoader
                style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                }}
                onInit={chartsInitializationAPI.configureAfterInit}
            >
                <SciChartReact style={{ flex: 1, flexBasis: "60%", minHeight: 0 }} initChart={chartsInitializationAPI.initMainChart3D} />
                <div style={{ display: "flex", flex: 1, flexBasis: "40%", minHeight: 0 }}>
                    <SciChartReact style={{ flex: 1, minWidth: 0 }} initChart={chartsInitializationAPI.initCrossSectionLeft} />
                    <SciChartReact style={{ flex: 1, minWidth: 0 }} initChart={chartsInitializationAPI.initCrossSectionRight} />
                </div>
            </ChartGroupLoader>
        </div>
    );
}
