import * as React from "react";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <SciChartReact
                initChart={drawExample}
                style={{
                    aspectRatio: "1 / 1",
                    width: "min(100%, 100vh)",
                    height: "auto",
                    position: "relative",
                    overflow: "hidden",
                    touchAction: "none",
                }}
            />
        </div>
    );
}
