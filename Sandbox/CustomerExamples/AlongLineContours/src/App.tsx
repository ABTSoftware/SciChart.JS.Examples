import { useEffect, useRef, useState } from "react";
import { drawExample, type CustomOptions } from "./drawExample";

// One slider step is one complete subdivision level: 2^n labels on loops, 2^n - 1 on open lines.
const MAX_LABELS_OPTIONS = [1, 2, 4, 8, 16, 32, 64];

export default function App() {
    const [isCustom, setIsCustom] = useState(true);
    const [customOptions, setCustomOptions] = useState<CustomOptions>({
        labelSpacing: 50,
        maxLabelsPerLine: 16,
        rotateToLine: true,
        avoidOverlaps: true,
    });
    const chartElement = useRef<HTMLDivElement>(null);
    const chart = useRef<undefined | {
        setIsCustom: (isCustom: boolean) => void;
        setCustomOptions: (options: CustomOptions) => void;
        delete: () => void;
    }>(undefined);

    useEffect(() => {
        let disposed = false;
        if (!chartElement.current) return;
        drawExample(chartElement.current).then((controller) => {
            if (disposed) controller.delete();
            else {
                chart.current = controller;
                controller.setIsCustom(isCustom);
            }
        });
        return () => {
            disposed = true;
            chart.current?.delete();
            chart.current = undefined;
        };
    }, []);

    const selectMode = (nextIsCustom: boolean) => {
        setIsCustom(nextIsCustom);
        chart.current?.setIsCustom(nextIsCustom);
    };

    const updateCustomOptions = (updates: Partial<CustomOptions>) => {
        const nextOptions = { ...customOptions, ...updates };
        setCustomOptions(nextOptions);
        chart.current?.setCustomOptions(nextOptions);
    };

    return (
        <main>
            <h1>Along-line contour labels</h1>
            <p>Uniform heatmap contour label comparison.</p>
            <p>
                <button
                    type="button"
                    aria-pressed={!isCustom}
                    onClick={() => selectMode(false)}
                    style={{
                        background: !isCustom ? "#111" : "#fff",
                        color: !isCustom ? "#fff" : "#111",
                    }}
                >
                    default
                </button>{" "}
                <button
                    type="button"
                    aria-pressed={isCustom}
                    onClick={() => selectMode(true)}
                    style={{
                        background: isCustom ? "#111" : "#fff",
                        color: isCustom ? "#fff" : "#111",
                    }}
                >
                    (custom) AlongLineContoursDataLabelProvider
                </button>
            </p>
            <div style={{ position: "relative" }}>
                <div ref={chartElement} />
                {isCustom && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            display: "grid",
                            gap: 8,
                            padding: 12,
                            color: "#fff",
                            background: "rgba(15, 23, 32, 0.5)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            borderRadius: 6,
                            fontSize: 13,
                            zIndex: 1,
                        }}
                    >
                        <label>
                            Label spacing (px): {customOptions.labelSpacing}
                            <input
                                type="range"
                                min="1"
                                max="300"
                                value={customOptions.labelSpacing}
                                onChange={(event) => updateCustomOptions({ labelSpacing: Number(event.target.value) })}
                                style={{ display: "block" }}
                            />
                        </label>
                        <label>
                            Max labels per line: {customOptions.maxLabelsPerLine}
                            <input
                                type="range"
                                min="0"
                                max={MAX_LABELS_OPTIONS.length - 1}
                                step="1"
                                value={MAX_LABELS_OPTIONS.indexOf(customOptions.maxLabelsPerLine)}
                                onChange={(event) =>
                                    updateCustomOptions({
                                        maxLabelsPerLine: MAX_LABELS_OPTIONS[Number(event.target.value)],
                                    })
                                }
                                style={{ display: "block" }}
                            />
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={customOptions.rotateToLine}
                                onChange={(event) => updateCustomOptions({ rotateToLine: event.target.checked })}
                            />{" "}
                            Rotate labels
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={customOptions.avoidOverlaps}
                                onChange={(event) => updateCustomOptions({ avoidOverlaps: event.target.checked })}
                            />{" "}
                            Avoid overlap
                        </label>
                    </div>
                )}
            </div>
            <p>Zoom in and out with both modes to see the improvement!</p>
        </main>
    );
}
