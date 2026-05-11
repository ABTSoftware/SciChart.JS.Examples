import * as React from "react";
import { IconButton, Popover, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import GestureIcon from "@mui/icons-material/Gesture";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

const overlayButtonSx = {
    position: "absolute" as const,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    color: "#ffffff",
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.75)" },
};

const activeOverlayButtonSx = {
    ...overlayButtonSx,
    backgroundColor: "#2D7FF9",
    "&:hover": { backgroundColor: "#2D7FF9" },
};

const DEFAULT_DRAWING_COLOR = "#686c70";
const COLOR_PALETTE = ["#686c70", "#3388FF", "#4EC385", "#F97066", "#F7C948", "#C792EA", "#F5F5F5"];

export default function FreehandDrawingTools() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
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
            if (
                target &&
                (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
            ) {
                return;
            }
            controlsRef.current?.removeLast();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", position: "relative" }}>
                <SciChartReact
                    style={{ flex: 1 }}
                    initChart={drawExample}
                    onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = result;
                        result.startDrawing("editableOutline", color);
                    }}
                />
                <Tooltip title="Drawing color" placement="right" arrow>
                    <IconButton
                        size="small"
                        aria-label="Drawing color"
                        onClick={(e) => setColorAnchor(e.currentTarget)}
                        sx={{
                            ...overlayButtonSx,
                            top: 8,
                            left: 8,
                            backgroundColor: color,
                            "&:hover": { backgroundColor: color, opacity: 0.85 },
                        }}
                    >
                        <span style={{ display: "block", width: 20, height: 20 }} />
                    </IconButton>
                </Tooltip>
                <Popover
                    open={Boolean(colorAnchor)}
                    anchorEl={colorAnchor}
                    onClose={() => setColorAnchor(null)}
                    anchorOrigin={{ vertical: "center", horizontal: "right" }}
                    transformOrigin={{ vertical: "center", horizontal: "left" }}
                >
                    <div style={{ display: "flex", gap: 6, padding: 6, backgroundColor: "rgba(0, 0, 0, 0.85)" }}>
                        {COLOR_PALETTE.map((c) => (
                            <button
                                key={c}
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
                            />
                        ))}
                    </div>
                </Popover>
                <Tooltip title="Toogle Draw / Select" placement="right" arrow>
                    <IconButton
                        size="small"
                        aria-label="Draw freehand"
                        onClick={toggleDrawing}
                        sx={{ ...(isDrawing ? activeOverlayButtonSx : overlayButtonSx), top: 8, left: 48 }}
                    >
                        <GestureIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete all annotations" placement="right" arrow>
                    <IconButton
                        size="small"
                        aria-label="Delete all annotations"
                        onClick={() => controlsRef.current?.clear()}
                        sx={{ ...overlayButtonSx, top: 8, left: 88 }}
                    >
                        <DeleteSweepIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Log annotation points JSON to console" placement="right" arrow>
                    <IconButton
                        size="small"
                        aria-label="Log annotation points JSON to console"
                        onClick={() => {
                            const data = controlsRef.current?.exportAnnotations() ?? [];
                            // eslint-disable-next-line no-console
                            console.log(JSON.stringify(data, null, 2));
                        }}
                        sx={{
                            ...overlayButtonSx,
                            top: 8,
                            left: 128,
                            opacity: 0.06,
                            transition: "opacity 150ms ease",
                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.75)", opacity: 1 },
                        }}
                    >
                        <SaveAltIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}
