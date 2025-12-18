import commonClasses from "../../../styles/Examples.module.scss";
// import { sciChartOverview } from "./createCandlestickChart";
import { SciChartReact, SciChartNestedOverview } from "scichart-react";
import { drawExample, sciChartOverview } from "./drawExample";

export default function OrderBookHeatmap() {
    return (
        <div className={commonClasses.ChartWrapper} style={{ display: "flex", flexDirection: "column" }}>
            <SciChartReact

                initChart={drawExample}
                style={{ display: "flex", flexDirection: "column", width: "100%", flex: "auto" }}
                innerContainerProps={{ style: { flexBasis: "90%", flexGrow: 1, flexShrink: 1 } }}
            >
                <SciChartNestedOverview
                    style={{ flexBasis: "10%", flexGrow: 1, flexShrink: 1 }}
                    options={sciChartOverview}
                />
            </SciChartReact>
        </div>
    );
}
