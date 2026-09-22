import * as React from "react";
import type { CSSProperties } from "react";
import { SciChartSurfaceBase } from "scichart";
import { DefaultFallback, SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

const loaderStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 12,
};

const loaderTextStyle: CSSProperties = {
    position: "absolute",
    bottom: "25%",
    width: "100%",
    textAlign: "center",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 14,
    // The spinner inside DefaultFallback sits at z-index 11, so the caption has to go above it
    zIndex: 12,
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function Model3DChart() {
    // The model is downloaded after the chart itself is created, so the chart's own loading fallback has
    // already gone by then. Keep a loader on screen until the model is in the scene.
    const [isModelLoading, setIsModelLoading] = React.useState(true);

    return (
        <div className={commonClasses.ChartWrapper}>
            <SciChartReact
                initChart={drawExample}
                style={{ width: "100%", height: "100%" }}
                onInit={({ waitForModel }: TResolvedReturnType<typeof drawExample>) =>
                    waitForModel(() => setIsModelLoading(false))
                }
            />
            {isModelLoading && (
                <div style={loaderStyle}>
                    <DefaultFallback />
                    {/* The fallback is drawn with the theme the app is using, so read the caption colour from it */}
                    <div style={{ ...loaderTextStyle, color: SciChartSurfaceBase.DEFAULT_THEME.axisTitleColor }}>
                        Downloading the 3D model...
                    </div>
                </div>
            )}
        </div>
    );
}
