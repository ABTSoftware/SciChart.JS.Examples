import "./styles.css";
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
            <header className="sc-toolbar-row">
                <button
                    className="sc-button sc-button-icon"
                    aria-label="Drawing color"
                    title="Drawing color"
                    aria-expanded={!!colorAnchor}
                    onClick={(e) => setColorAnchor(colorAnchor ? null : e.currentTarget)}
                    type="button"
                >
                    <span style={{ width: 16, height: 16, backgroundColor: color, borderRadius: "var(--radius)" }} />
                </button>
                {colorAnchor && (
                    <div
                        ref={paletteRef}
                        className="sc-color-palette"
                        role="group"
                        aria-label="Drawing colors"
                        style={{
                            left: colorAnchor.getBoundingClientRect().left,
                            top: colorAnchor.getBoundingClientRect().bottom + 4,
                        }}
                    >
                        {COLOR_PALETTE.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className="sc-button sc-button-icon"
                                aria-label={`Choose color ${c}`}
                                aria-pressed={c === color}
                                onClick={() => handleSelectColor(c)}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                )}
                <button
                    className="sc-button sc-button-icon"
                    aria-label="Draw freehand"
                    title="Toggle draw / select"
                    aria-pressed={isDrawing}
                    onClick={toggleDrawing}
                    type="button"
                >
                    <GestureIcon />
                </button>
                <button
                    className="sc-button sc-button-icon sc-button-destructive"
                    aria-label="Delete all annotations"
                    title="Delete all annotations"
                    onClick={() => controlsRef.current?.clear()}
                    type="button"
                >
                    <DeleteSweepIcon />
                </button>
                <button
                    className="sc-button sc-button-icon"
                    aria-label="Log annotation points JSON to console"
                    title="Log annotation points JSON to console"
                    onClick={() => console.log(JSON.stringify(controlsRef.current?.exportAnnotations() ?? [], null, 2))}
                    type="button"
                >
                    <SaveAltIcon />
                </button>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                    result.startDrawing("editableOutline", color);
                }}
            />
        </div>
    );
}
