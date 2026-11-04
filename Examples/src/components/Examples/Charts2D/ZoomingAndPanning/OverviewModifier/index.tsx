import { SciChartReact, SciChartNestedOverview } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

export default function Overview() {
    return (
        <div className="sc-chart-wrapper">
            <SciChartReact
                initChart={drawExample}
                className="sc-overview-chart"
            >
                <SciChartNestedOverview 
                    className="sc-overview" 
                    options={overviewOptions} 
                />
            </SciChartReact>
        </div>
    );
}
