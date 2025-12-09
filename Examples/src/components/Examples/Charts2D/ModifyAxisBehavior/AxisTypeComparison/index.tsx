import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartGroup } from "scichart-react";
import { drawIndexChart, drawLinearChart, drawCategoryChart } from "./drawExample";

export default function AxisTypeComparisonExample() {
    return (
        <div className={commonClasses.ChartWrapper}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    gap: "2px",
                    backgroundColor: "black",
                }}
            >
                <SciChartGroup>
                    {/* Index Chart */}
                    <SciChartReact
                        initChart={drawIndexChart}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Linear Chart */}
                    <SciChartReact
                        initChart={drawLinearChart}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Category Chart */}
                    <SciChartReact
                        initChart={drawCategoryChart}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />
                </SciChartGroup>
            </div>
        </div>
    );
}
