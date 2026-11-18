import { SciChartReact } from "scichart-react";
import {
    drawExample,
    containerId2,
    subChartWrapper1,
    subChartWrapper2,
    subChartWrapper3,
    dividerId1,
    dividerId2,
} from "./drawExample";

export * from "./drawExample";

export default function SubChartStockCharts() {
    return (
        <div className="sc-chart-wrapper" id={containerId2}>
            <div id={subChartWrapper1} className="absolute" />
            <div
                id={dividerId1}
                className="w-full absolute"
                style={{ height: "0.125rem", backgroundColor: "var(--border-color)", cursor: "row-resize", zIndex: 1 }}
            >
                <div className="w-full" style={{ height: "0.25rem", borderBottom: "2px dashed" }}></div>
            </div>
            <div id={subChartWrapper2} className="absolute" />
            <div
                id={dividerId2}
                className="w-full absolute"
                style={{ height: "0.125rem", backgroundColor: "var(--border-color)", cursor: "row-resize", zIndex: 1 }}
            >
                <div className="w-full" style={{ height: "0.25rem", borderBottom: "2px dashed" }}></div>
            </div>
            <div id={subChartWrapper3} className="absolute" />
            <SciChartReact
                initChart={drawExample}
                className="w-full h-full"
                style={{ minWidth: "100%", maxWidth: "100%", minHeight: "100%", maxHeight: "100%" }}
            />
        </div>
    );
}
