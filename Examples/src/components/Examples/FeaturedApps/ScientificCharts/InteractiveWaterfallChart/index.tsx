import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartGroup, SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function InteractiveWaterfallChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <React.Fragment>
            <div style={{ background: appTheme.Background }} className={commonClasses.ChartWrapper}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: appTheme.DarkIndigo,
                    }}
                >
                    <SciChartGroup
                        onInit={() => {
                            chartsInitializationAPI.configureAfterInit();
                        }} // callback executed when all charts within the group are initialized
                    >
                        <SciChartReact
                            style={{ flex: 1, flexBasis: "50%" }}
                            initChart={chartsInitializationAPI.initMainChart}
                        />
                        <div style={{ display: "flex", flex: 1, flexBasis: "50%" }}>
                            <SciChartReact
                                style={{ flex: 1 }}
                                initChart={chartsInitializationAPI.initCrossSectionLeft}
                            />
                            <SciChartReact
                                style={{ flex: 1 }}
                                initChart={chartsInitializationAPI.initCrossSectionRight}
                            />
                        </div>
                    </SciChartGroup>
                </div>
            </div>
        </React.Fragment>
    );
}
