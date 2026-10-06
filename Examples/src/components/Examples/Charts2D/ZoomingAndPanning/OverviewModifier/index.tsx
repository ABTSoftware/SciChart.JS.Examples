import { SciChartReact, SciChartNestedOverview } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

export default function Overview() {
    return (
        <div className="sc-chart-wrapper">
            <div className="flex flex-col h-full">
                <SciChartReact
                    initChart={drawExample}
                    className="sc-overview-chart"
                    innerContainerProps={{ className: "sc-main-chart" }}
                >
                    <SciChartNestedOverview
                        className="sc-overview"
                        options={overviewOptions}
                    />
                </SciChartReact>
            </div>
        </div>
    );
}
