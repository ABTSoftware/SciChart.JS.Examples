import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {

    return (
        <div className={commonClasses.ChartWrapper}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: appTheme.DarkIndigo,
                }}
            >
                <SciChartReact
                    initChart={drawExample}
                    style={{ flex: 1 }}
                />
            </div>
        </div>
    );
}
