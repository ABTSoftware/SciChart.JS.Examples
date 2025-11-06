import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, IPaneManagementConfig, EChartType } from "./drawExample";
import {
    IPanelResizeEventData,
    IPanelMoveEventData,
    IPanelMaximizeEventData,
    IPanelRemovalEventData,
} from "./LayoutManager/chartManager";
import "./style.css";


const exampleConfig1: IPaneManagementConfig = {
    charts: [
        {
            title: "EUR/USD Price Chart",
            chartType: EChartType.PriceChart,
            useTradingData: true,
        },
        {
            title: "MACD Indicator",
            chartType: EChartType.MacdChart,
            useTradingData: true,
        },
        {
            title: "RSI Indicator",
            chartType: EChartType.RsiChart,
            useTradingData: true,
        },
    ],
    positions: [{ height: 0.4 }, { height: 0.3 }, { height: 0.3 }],
};

const callbacks = {
    onPanelResize: (data: IPanelResizeEventData) => {
        console.log("Panel resized:", {
            visualIndex: data.visualIndex,
            oldSize: data.oldSize.toFixed(3),
            newSize: data.newSize.toFixed(3),
            splitterIndex: data.splitterIndex,
        });
    },
    onPanelMove: (data: IPanelMoveEventData) => {
        console.log("Panel moved:", {
            fromIndex: data.fromIndex,
            toIndex: data.toIndex,
            direction: data.direction,
            visualIndex: data.visualIndex,
        });
    },
    onPanelMaximize: (data: IPanelMaximizeEventData) => {
        console.log("Panel maximize toggled:", {
            visualIndex: data.visualIndex,
            isMaximized: data.isMaximized,
            wasMaximized: data.wasMaximized,
        });
    },
    onPanelRemoval: (data: IPanelRemovalEventData) => {
        console.log("Panel removed:", {
            visualIndex: data.visualIndex,
            actualChartIndex: data.actualChartIndex,
            chartTitle: data.removedChartConfig?.title || "Unknown",
        });
    },
};

export default function MultiPaneCharts() {
    const [useConfig, setUseConfig] = React.useState(true);
    const [chartInstance, setChartInstance] = React.useState<any>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const initChartWithConfig = React.useCallback(
        (divElementId: string | HTMLDivElement) => {
            console.log("initChartWithConfig");

            // Create configuration with callbacks
            const configWithCallbacks: IPaneManagementConfig = useConfig
                ? {
                      ...exampleConfig1,
                      callbacks,
                  }
                : { callbacks };

            return drawExample(divElementId, configWithCallbacks);
        },
        [useConfig]
    );

    const handleAddCustomCharts = () => {
        chartInstance.loadConfiguration(exampleConfig1);
    };

    // const handleAddCustomChart = () => {
    //     if (chartInstance) {
    //         // Example of adding a chart with custom data using the new API
    //         const customXValues = Array.from({ length: 100 }, (_, i) => i);
    //         const customYValues = Array.from({ length: 100 }, (_, i) => Math.tan(i * 0.1) * 0.5 + 70);

    //         chartInstance.addChartWithData(customXValues, customYValues, {
    //             title: "Custom Tan Wave (Line)",
    //             color: appTheme.VividGreen,
    //             strokeThickness: 2,
    //             height: 0.2,
    //             xAxisTitle: "Custom X",
    //             yAxisTitle: "Custom Y",
    //             chartType: EChartType.Line,
    //         });
    //     }
    // };

    // const handleAddScatterChart = () => {
    //     if (chartInstance) {
    //         // Generate scatter plot data with some correlation
    //         const customXValues = Array.from({ length: 100 }, (_, i) => i + Math.random() * 5);
    //         const customYValues = Array.from({ length: 100 }, (_, i) => i * 2 + Math.random() * 20 + 10);

    //         chartInstance.addChartWithData(customXValues, customYValues, {
    //             title: "Custom Scatter Plot",
    //             color: appTheme.VividPurple,
    //             height: 0.25,
    //             xAxisTitle: "X Values",
    //             yAxisTitle: "Y Values",
    //             chartType: EChartType.Scatter,
    //             pointMarkerSize: 6,
    //             pointMarkerFill: appTheme.VividPurple,
    //             pointMarkerStroke: appTheme.VividPurple,
    //         });
    //     }
    // };

    // const handleAddLineChart = () => {
    //     if (chartInstance) {
    //         // Generate smooth line chart data
    //         const customXValues = Array.from({ length: 100 }, (_, i) => i);
    //         const customYValues = Array.from(
    //             { length: 100 },
    //             (_, i) => Math.sin(i * 0.15) * 25 + Math.cos(i * 0.08) * 15 + 50
    //         );

    //         chartInstance.addChartWithData(customXValues, customYValues, {
    //             title: "Custom Sine/Cosine Wave",
    //             color: appTheme.VividTeal,
    //             strokeThickness: 2,
    //             height: 0.2,
    //             xAxisTitle: "Time",
    //             yAxisTitle: "Amplitude",
    //             chartType: EChartType.Line,
    //         });
    //     }
    // };

    const handleAddPriceChart = async () => {
        if (chartInstance) {
            await chartInstance.addChart(
                {
                    title: "EUR/USD Price Chart",
                    chartType: EChartType.PriceChart,
                    useTradingData: true,
                },
                { height: 0.4 }
            );
        }
    };

    const handleAddMacdChart = async () => {
        if (chartInstance) {
            await chartInstance.addChart(
                {
                    title: "MACD Indicator",
                    chartType: EChartType.MacdChart,
                    useTradingData: true,
                },
                { height: 0.3 }
            );
        }
    };

    const handleAddRsiChart = async () => {
        if (chartInstance) {
            await chartInstance.addChart(
                {
                    title: "RSI Indicator",
                    chartType: EChartType.RsiChart,
                    useTradingData: true,
                },
                { height: 0.3 }
            );
        }
    };

    const handleSaveConfiguration = () => {
        if (chartInstance && chartInstance.saveConfiguration) {
            chartInstance.saveConfiguration();
        } else {
            console.warn("Save configuration functionality not available");
        }
    };

    const handleLoadConfiguration = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && chartInstance && chartInstance.loadConfigurationFromFile) {
            chartInstance.loadConfigurationFromFile(file);
            // Reset the file input so the same file can be selected again
            event.target.value = "";
        } else if (!chartInstance) {
            console.warn("Chart instance not available");
        } else {
            console.warn("Load configuration functionality not available");
        }
    };

    return (
        <div className="chartContainer">
            <div className="header">
                <button
                    onClick={handleAddPriceChart}
                    style={{ cursor: "pointer", backgroundColor: "#4CAF50", color: "white" }}
                >
                    Price Chart
                </button>
                <button
                    onClick={handleAddMacdChart}
                    style={{ cursor: "pointer", backgroundColor: "#FF9800", color: "white" }}
                >
                    MACD Chart
                </button>
                <button
                    onClick={handleAddRsiChart}
                    style={{ cursor: "pointer", backgroundColor: "#9C27B0", color: "white" }}
                >
                    RSI Chart
                </button>
                <button onClick={handleAddCustomCharts} style={{ cursor: "pointer" }}>
                    Custom Charts
                </button>
                <button id="removeChartBtn" style={{ cursor: "pointer" }}>
                    Remove Last
                </button>
                <button
                    onClick={handleSaveConfiguration}
                    style={{
                        padding: "5px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Save Config
                </button>
                <button
                    onClick={handleLoadConfiguration}
                    style={{
                        padding: "5px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Load Config
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    aria-label="Load chart configuration file"
                />
            </div>
            <SciChartReact
                initChart={initChartWithConfig}
                className={commonClasses.ChartWrapper}
                onInit={setChartInstance}
            />
        </div>
    );
}
