import { useRef, useState, useEffect } from "react";
import { DeleteSweepIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

const DEFAULT_DRAWING_COLOR = "#686c70";

export default function FreehandDrawingTools() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [isDrawing, setIsDrawing] = useState(true);
    const [color, setColor] = useState(DEFAULT_DRAWING_COLOR);
    const [thickness, setThickness] = useState(4);
    const [opacity, setOpacity] = useState(100);

    const setDrawingMode = (enabled: boolean) => {
        if (enabled) {
            controlsRef.current?.startDrawing(color, thickness, opacity / 100);
        } else {
            controlsRef.current?.stopDrawing();
        }
        setIsDrawing(enabled);
    };

    const updateDrawingStyle = (nextColor: string, nextThickness: number, nextOpacity: number) => {
        if (!Number.isFinite(nextThickness) || nextThickness < 1 || nextThickness > 20) return;
        if (!Number.isFinite(nextOpacity) || nextOpacity < 0 || nextOpacity > 100) return;
        setColor(nextColor);
        setThickness(nextThickness);
        setOpacity(nextOpacity);
        if (isDrawing) {
            controlsRef.current?.startDrawing(nextColor, nextThickness, nextOpacity / 100);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Backspace") return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return;
            }
            controlsRef.current?.removeLast();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Chart interaction mode">
                    <button
                        className="sc-button"
                        aria-pressed={!isDrawing}
                        onClick={() => setDrawingMode(false)}
                        type="button"
                    >
                        Pan
                    </button>
                    <button
                        className="sc-button"
                        aria-pressed={isDrawing}
                        onClick={() => setDrawingMode(true)}
                        type="button"
                    >
                        Draw
                    </button>
                </div>

                <div className="flex items-center gap-2" style={{ opacity: isDrawing ? 1 : 0.5 }}>
                    <label className="sc-control">
                        Color
                        <input
                            className="sc-input"
                            type="color"
                            value={color}
                            disabled={!isDrawing}
                            onChange={(event) => updateDrawingStyle(event.target.value, thickness, opacity)}
                            title="Drawing color"
                        />
                    </label>
                    <label className="sc-control">
                        Thickness
                        <input
                            className="sc-input"
                            type="number"
                            min={1}
                            max={20}
                            step={1}
                            value={thickness}
                            disabled={!isDrawing}
                            onChange={(event) => updateDrawingStyle(color, event.target.valueAsNumber, opacity)}
                            style={{ width: 50 }}
                            title="Stroke thickness in pixels"
                        />
                    </label>
                    <label className="sc-control">
                        Opacity (%)
                        <input
                            className="sc-input"
                            type="number"
                            min={0}
                            max={100}
                            step={5}
                            value={opacity}
                            disabled={!isDrawing}
                            onChange={(event) => updateDrawingStyle(color, thickness, event.target.valueAsNumber)}
                            style={{ width: 58 }}
                        />
                    </label>
                </div>

                {/* <div className="flex items-center gap-2">
                    <button
                        className="sc-button sc-button-outline"
                        aria-label="Log annotation points JSON to console"
                        title="Log annotation points JSON to console"
                        onClick={() =>
                            console.log(JSON.stringify(controlsRef.current?.exportAnnotations() ?? [], null, 2))
                        }
                        type="button"
                    >
                        Log JSON
                    </button>
                    <button
                        className="sc-button sc-button-icon sc-button-danger"
                        aria-label="Delete all annotations"
                        title="Delete all annotations"
                        onClick={() => controlsRef.current?.clear()}
                        type="button"
                    >
                        <DeleteSweepIcon />
                    </button>
                </div> */}
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                    result.startDrawing(color, thickness, opacity / 100);
                }}
            />
        </div>
    );
}
