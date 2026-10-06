import "./styles.css";
import { useState, useEffect, useCallback } from "react";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { estimateModelProgress, formatProgressPercent } from "./modelLoadProgress";
import carImage from "./javascript-3d-model-chart.jpg";

/** How often the estimated progress is recomputed while the model downloads. */
const PROGRESS_TICK_MS = 100;

/** Roughly the transfer size of the asset package, so the wait is explicable. */
const PACKAGE_SIZE_LABEL = "~27 MB";

export default function Model3DChart() {
    // The model is downloaded after the chart itself is created, so the chart's own loading fallback has
    // already gone by then. Keep the overlay on screen until the model is in the scene.
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Estimated, not measured — see modelLoadProgress.ts for why the real byte count is
    // not available. Stops as soon as the model lands.
    useEffect(() => {
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

    const handleInit = useCallback(({ waitForModel }: TResolvedReturnType<typeof drawExample>) => {
        // waitForModel polls the entity and hands back a disposer; returning it from onInit
        // keeps the poll from outliving the chart when navigating away mid-download.
        return waitForModel(() => {
            setProgress(1);
            setIsModelLoading(false);
        });
    }, []);

    return (
        <div className="sc-chart-wrapper">
            <SciChartReact initChart={drawExample} className="w-full h-full" onInit={handleInit} />
            {isModelLoading && (
                <div className="absolute flex flex-col items-center justify-end sc-model-loading-overlay">
                    <img src={carImage} alt="" className="absolute w-full h-full sc-model-preview" />
                    <div className="relative text-center sc-model-download-panel">
                        <div className="overflow-hidden sc-model-progress-track">
                            <div
                                className="sc-model-progress-fill h-full"
                                style={{ width: `${Math.min(progress, 1) * 100}%` }}
                            />
                        </div>
                        <div className="sc-model-progress-label">
                            Downloading the 3D model ({PACKAGE_SIZE_LABEL})… {formatProgressPercent(progress)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
