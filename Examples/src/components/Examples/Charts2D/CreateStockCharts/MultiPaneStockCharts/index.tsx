import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { SciChartSurface } from "scichart";
import { ChartGroupLoader } from "scichart-react";

export default function MultiPaneStockCharts() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);
    const [mainChart, setMainChart] = useState<SciChartSurface>();

    return (
        <ChartGroupLoader className="sc-chart-wrapper" onInit={chartsInitializationAPI.configureAfterInit}>
            <div className="flex flex-col h-full">
                {/*The panel hosting the price chart*/}
                <SciChartReact<SciChartSurface>
                    initChart={chartsInitializationAPI.drawPriceChart}
                    style={{ flex: "1 1 400px" }}
                    onInit={({ sciChartSurface }) => setMainChart(sciChartSurface)}
                />
                {/*Panels hosting the Macd and RSI Indicator charts*/}
                <SciChartReact initChart={chartsInitializationAPI.drawMacdChart} style={{ flex: "1 1 100px" }} />
                <SciChartReact initChart={chartsInitializationAPI.drawRsiChart} style={{ flex: "1 1 100px" }} />

                {/*Panel hosting the overview control*/}
                <div style={{ flexBasis: 70 }}>
                    {mainChart ? (
                        <SciChartReact
                            initChart={chartsInitializationAPI.drawOverview(mainChart)}
                            className="w-full h-full"
                        />
                    ) : null}
                </div>
            </div>
        </ChartGroupLoader>
    );
}
