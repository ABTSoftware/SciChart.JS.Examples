import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { SciChartSurface } from "scichart";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample, overViewOption } from "./drawExample";

export default function Overview() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <SciChartReact
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface } = initResult;
                        sciChartSurfaceRef.current = sciChartSurface;
                    }}
                    style={{ display: "flex", flexDirection: "column", height: "calc(100% - 70px)", width: "100%" }}
                    innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
                >
                    <SciChartNestedOverview
                        style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                        options={overViewOption}
                    />
                </SciChartReact>
            </div>
        </div>
    );
}
