import * as React from "react";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";
import { estimateModelProgress, formatProgressPercent } from "./modelLoadProgress";
import carImage from "./javascript-3d-model-chart.jpg";

/** How often the estimated progress is recomputed while the model downloads. */
const PROGRESS_TICK_MS = 100;

/** Roughly the transfer size of the asset package, so the wait is explicable. */
const PACKAGE_SIZE_LABEL = "~27 MB";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function Model3DChart() {
    // The model is downloaded after the chart itself is created, so the chart's own loading fallback has
    // already gone by then. Keep the overlay on screen until the model is in the scene.
    const [isModelLoading, setIsModelLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(0);

    // Estimated, not measured — see modelLoadProgress.ts for why the real byte count is
    // not available. Stops as soon as the model lands.
    React.useEffect(() => {
        if (!isModelLoading) {
            return undefined;
        }

        const startedAt = Date.now();
        const intervalId = setInterval(
            () => setProgress(estimateModelProgress(Date.now() - startedAt)),
            PROGRESS_TICK_MS
        );

        return () => clearInterval(intervalId);
    }, [isModelLoading]);

    const handleInit = React.useCallback(({ waitForModel }: TResolvedReturnType<typeof drawExample>) => {
        // waitForModel polls the entity and hands back a disposer; returning it from onInit
        // keeps the poll from outliving the chart when navigating away mid-download.
        return waitForModel(() => {
            setProgress(1);
            setIsModelLoading(false);
        });
    }, []);

    return (
        <div className="sc-chart-wrapper">
            <SciChartReact initChart={drawExample} style={{ width: "100%", height: "100%" }} onInit={handleInit} />
            {isModelLoading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // Sat low rather than centred, so the panel does not cover the car behind it.
                        justifyContent: "flex-end",
                        paddingBottom: "12%",
                        background: "var(--bg-chart)",
                        fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                >
                    <img
                        src={carImage}
                        alt=""
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            opacity: 0.9,
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            width: "min(420px, 70%)",
                            textAlign: "center",
                            padding: "16px 20px",
                            borderRadius: "var(--radius)",
                            background: "var(--bg-chart)",
                            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <div
                            style={{
                                height: 6,
                                borderRadius: "var(--radius)",
                                overflow: "hidden",
                                background: "rgba(255, 255, 255, 0.15)",
                            }}
                        >
                            <div
                                style={{
                                    width: `${Math.min(progress, 1) * 100}%`,
                                    height: "100%",
                                    background: appTheme.VividSkyBlue,
                                    transition: `width ${PROGRESS_TICK_MS}ms linear`,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                fontSize: 14,
                                color: appTheme.ForegroundColor,
                            }}
                        >
                            Downloading the 3D model ({PACKAGE_SIZE_LABEL})… {formatProgressPercent(progress)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
