import * as React from "react";
import { DeleteSweepIcon, GestureIcon, SaveAltIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

const DEFAULT_DRAWING_COLOR = "#686c70";
const COLOR_PALETTE = ["#686c70", "#3388FF", "#4EC385", "#F97066", "#F7C948", "#C792EA", "#F5F5F5"];

export default function FreehandDrawingTools() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const paletteRef = React.useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = React.useState(true);
    const [color, setColor] = React.useState(DEFAULT_DRAWING_COLOR);
    const [colorAnchor, setColorAnchor] = React.useState<HTMLElement | null>(null);

    const toggleDrawing = () => {
        if (isDrawing) {
            controlsRef.current?.stopDrawing();
            setIsDrawing(false);
        } else {
            controlsRef.current?.startDrawing("editableOutline", color);
            setIsDrawing(true);
        }
    };

    const handleSelectColor = (next: string) => {
        setColor(next);
        setColorAnchor(null);
        if (isDrawing) {
            controlsRef.current?.stopDrawing();
            controlsRef.current?.startDrawing("editableOutline", next);
        }
    };

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (!colorAnchor) return undefined;
        const closeOnOutsideClick = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!colorAnchor.contains(target) && !paletteRef.current?.contains(target)) setColorAnchor(null);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setColorAnchor(null);
        };
        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [colorAnchor]);

    return (
        <div className="sc-chart-wrapper">
            <div style={{ flex: 1, minWidth: 0, display: "flex", position: "relative" }}>
                <SciChartReact
                    style={{ flex: 1 }}
                    initChart={drawExample}
                    onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = result;
                        result.startDrawing("editableOutline", color);
                    }}
                />
                <button
                    className="sc-button sc-button-icon sc-overlay-button"
                    aria-label="Drawing color"
                    title="Drawing color"
                    onClick={(e) => setColorAnchor(colorAnchor ? null : e.currentTarget)}
                    type="button"
                >
                    <span
                        style={{ display: "block", width: 20, height: 20, backgroundColor: color, borderRadius: "50%" }}
                    />
                </button>
                {colorAnchor && (
                    <div
                        ref={paletteRef}
                        className="sc-color-palette"
                        role="group"
                        aria-label="Drawing colors"
                        style={{
                            left: colorAnchor.getBoundingClientRect().right + 8,
                            top: colorAnchor.getBoundingClientRect().top + colorAnchor.offsetHeight / 2,
                        }}
                    >
                        {COLOR_PALETTE.map((c) => (
                            <button
                                key={c}
                                type="button"
                                aria-label={`Choose color ${c}`}
                                onClick={() => handleSelectColor(c)}
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    backgroundColor: c,
                                    border: c === color ? "2px solid #ffffff" : "2px solid transparent",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                                className="sc-button sc-color-swatch"
                            />
                        ))}
                    </div>
                )}
                <button
                    className="sc-button sc-button-icon sc-overlay-button"
                    aria-label="Draw freehand"
                    title="Toggle draw / select"
                    onClick={toggleDrawing}
                    type="button"
                >
                    <GestureIcon fontSize="small" />
                </button>
                <button
                    className="sc-button sc-button-icon sc-overlay-button"
                    aria-label="Delete all annotations"
                    title="Delete all annotations"
                    onClick={() => controlsRef.current?.clear()}
                    type="button"
                >
                    <DeleteSweepIcon fontSize="small" />
                </button>
                <button
                    className="sc-button sc-button-icon sc-overlay-button"
                    aria-label="Log annotation points JSON to console"
                    title="Log annotation points JSON to console"
                    onClick={() => {
                        const data = controlsRef.current?.exportAnnotations() ?? [];
                        // eslint-disable-next-line no-console
                        console.log(JSON.stringify(data, null, 2));
                    }}
                    type="button"
                >
                    <SaveAltIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
}
