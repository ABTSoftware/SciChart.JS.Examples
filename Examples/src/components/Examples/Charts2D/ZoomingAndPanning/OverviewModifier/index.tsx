import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

export default function Overview() {
    return (
        <div className={commonClasses.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <SciChartReact
                    initChart={drawExample}
                    style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}
                    innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
                >
                    <SciChartNestedOverview
                        style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                        options={overviewOptions}
                    />
                </SciChartReact>
            </div>
        </div>
    );
}
