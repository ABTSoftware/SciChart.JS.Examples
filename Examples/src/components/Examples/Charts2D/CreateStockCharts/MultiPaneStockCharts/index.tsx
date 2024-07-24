import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartGroup, SciChartReact } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { getChartsInitializationAPI } from "./drawExample";
import { SciChartSurface } from "scichart";

export default function MultiPaneStockCharts() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI());
    const [mainChart, setMainChart] = React.useState<SciChartSurface>();

    return (
        <div className={classes.ChartWrapper}>
            <SciChartGroup onInit={chartsInitializationAPI.configureAfterInit}>
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
                    {mainChart ? (
                        <SciChartReact
                            initChart={chartsInitializationAPI.drawOverview(mainChart)}
                            style={{ flexBasis: "70px" }}
                        />
                    ) : null}
                </div>
            </SciChartGroup>
        </div>
    );
}
