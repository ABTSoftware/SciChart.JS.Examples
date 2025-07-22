import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";
import { SciChartSurface } from "scichart";
import { ChartGroupLoader } from "scichart-react";

export default function MultiPaneStockCharts() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);
    const [mainChart, setMainChart] = React.useState<SciChartSurface>();

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper} onInit={chartsInitializationAPI.configureAfterInit}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/*The panel hosting the price chart*/}
                <SciChartReact<SciChartSurface>
                    initChart={chartsInitializationAPI.drawPriceChart}
                    style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }}
                    onInit={({ sciChartSurface }) => setMainChart(sciChartSurface)}
                />
                {/*Panels hosting the Macd and RSI Indicator charts*/}
                <SciChartReact
                    initChart={chartsInitializationAPI.drawMacdChart}
                    style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }}
                />
                <SciChartReact
                    initChart={chartsInitializationAPI.drawRsiChart}
                    style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }}
                />

                {/*Panel hosting the overview control*/}
                <div style={{ flexBasis: "70px" }}>
                    {mainChart ? (
                        <SciChartReact
                            initChart={chartsInitializationAPI.drawOverview(mainChart)}
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : null}
                </div>
            </div>
        </ChartGroupLoader>
    );
}
