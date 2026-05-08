import * as React from "react";
import { Checkbox, FormControl, FormControlLabel, IconButton, MenuItem, Select, ToggleButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { ETradingAnnotationType } from "scichart-financial-tools";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

type TStartToolOptions = Parameters<TResolvedReturnType<typeof drawExample>["startTool"]>[1];

type TToolItemDefinition = {
    value: string;
    annotationType: ETradingAnnotationType;
    options?: TStartToolOptions;
    label: string;
    icon: React.ReactNode;
};

type TToolDefinition = TToolItemDefinition | "separator";

const isToolItemDefinition = (tool: TToolDefinition): tool is TToolItemDefinition => tool !== "separator";

const iconStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    display: "block",
    marginRight: 6,
};

const icon = (children: React.ReactNode) => (
    <svg viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="1.8">
        {children}
    </svg>
);

const tools: TToolDefinition[] = [
    {
        value: "polyline",
        annotationType: ETradingAnnotationType.PolyLineAnnotation,
        label: "Polyline",
        icon: icon(<polyline points="4,18 9,7 14,14 20,6" />),
    },
    {
        value: "snappedPolyline",
        annotationType: ETradingAnnotationType.PolyLineAnnotation,
        options: { snapToCandle: true },
        label: "Snapped Polyline",
        icon: icon(
            <>
                <polyline points="4,18 9,7 14,14 20,6" />
                <circle cx="14" cy="14" r="1.7" fill="currentColor" />
            </>
        ),
    },
    "separator",
    {
        value: "extendedLine",
        annotationType: ETradingAnnotationType.ExtendedLineAnnotation,
        label: "Extended Line",
        icon: icon(<line x1="4" y1="18" x2="20" y2="6" />),
    },
    {
        value: "leftRay",
        annotationType: ETradingAnnotationType.ExtendedLineAnnotation,
        options: { extendEnd: false },
        label: "Left Ray",
        icon: icon(
            <>
                <line x1="6" y1="16" x2="20" y2="6" />
                <polyline points="9,16 5,16 5,12" />
            </>
        ),
    },
    {
        value: "rightRay",
        annotationType: ETradingAnnotationType.ExtendedLineAnnotation,
        options: { extendStart: false },
        label: "Right Ray",
        icon: icon(
            <>
                <line x1="4" y1="18" x2="18" y2="8" />
                <polyline points="15,8 19,8 19,12" />
            </>
        ),
    },
    "separator",
    {
        value: "channel",
        annotationType: ETradingAnnotationType.ChannelAnnotation,
        label: "Channel",
        icon: icon(
            <>
                <line x1="4" y1="7" x2="20" y2="3" />
                <line x1="4" y1="12.5" x2="20" y2="8.5" strokeDasharray="2 2" />
                <line x1="4" y1="18" x2="20" y2="14" />
            </>
        ),
    },
    {
        value: "flatBottomChannel",
        annotationType: ETradingAnnotationType.FlatBottomChannelAnnotation,
        label: "Flat Bottom Channel",
        icon: icon(
            <>
                <line x1="4" y1="20" x2="20" y2="8" />
                <line x1="4" y1="17" x2="20" y2="17" />
            </>
        ),
    },
    {
        value: "disjointChannel",
        annotationType: ETradingAnnotationType.DisjointChannelAnnotation,
        label: "Disjoint Channel",
        icon: icon(
            <>
                <line x1="4" y1="20" x2="20" y2="8" />
                <line x1="4" y1="4" x2="20" y2="16" />
                <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="2 2" />
            </>
        ),
    },
    "separator",
    {
        value: "pitchfork",
        annotationType: ETradingAnnotationType.PitchforkAnnotation,
        label: "Pitchfork",
        icon: icon(
            <>
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="6" y2="20" />
                <line x1="18" y1="12" x2="18" y2="20" />
            </>
        ),
    },
    {
        value: "pitchfan",
        annotationType: ETradingAnnotationType.PitchfanAnnotation,
        label: "Pitchfan",
        icon: icon(
            <>
                <line x1="12" y1="4" x2="4" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="12" y1="4" x2="20" y2="20" />
            </>
        ),
    },
    "separator",
    {
        value: "fibonacci",
        annotationType: ETradingAnnotationType.FibonacciRetracementAnnotation,
        label: "Fibonacci Retracement",
        icon: icon(
            <>
                <line x1="4" y2="4" x2="16" y1="6" />
                <line x1="6" y2="9" x2="18" y1="11" />
                <line x1="8" y2="14" x2="20" y1="16" />
                <line x1="10" y2="19" x2="22" y1="21" />
            </>
        ),
    },
    {
        value: "verticalFibonacci",
        annotationType: ETradingAnnotationType.FibonacciRetracementAnnotation,
        options: { verticalOnly: true },
        label: "Vertical Fibonacci Ret.",
        icon: icon(
            <>
                <line x1="4" y1="5" x2="20" y2="5" />
                <line x1="4" y1="10" x2="20" y2="10" />
                <line x1="4" y1="15" x2="20" y2="15" />
                <line x1="4" y1="20" x2="20" y2="20" />
            </>
        ),
    },
    "separator",
    {
        value: "measure",
        annotationType: ETradingAnnotationType.MeasureAnnotation,
        label: "Measure",
        icon: icon(
            <>
                <rect x="4" y="4" width="16" height="16" rx="1.5" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="12" y1="6" x2="12" y2="18" />
            </>
        ),
    },
    "separator",
    {
        value: "stopLossTakeProfit",
        annotationType: ETradingAnnotationType.StopLossTakeProfitAnnotation,
        label: "Stop Loss / Take Profit",
        icon: (
            <svg viewBox="0 0 24 24" style={iconStyle} fill="currentColor">
                <path d="M6 5h12v5H6z" />
                <path d="M6 14h12v5H6z" opacity="0.65" />
            </svg>
        ),
    },
    "separator",
    {
        value: "freehand",
        annotationType: ETradingAnnotationType.FreehandDrawingAnnotation,
        label: "Freehand",
        icon: icon(
            <>
                <path d="M4 16c2-4 4-4 6 0s4 4 6 0 3-4 4-1" />
                <path d="M17 5l2-2 2 2-2 2z" />
            </>
        ),
    },
    {
        value: "lockedFreehand",
        annotationType: ETradingAnnotationType.FreehandDrawingAnnotation,
        options: { lockedAspect: true },
        label: "Freehand 1:1",
        icon: icon(
            <>
                <path d="M4 16c2-4 4-4 6 0s4 4 6 0 3-4 4-1" />
                <rect x="7" y="3" width="10" height="7" rx="1" />
            </>
        ),
    },
];

export default function TradingAnnotationsToolbox() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [selectedTool, setSelectedTool] = React.useState("channel");
    const [keepPlacing, setKeepPlacing] = React.useState(false);
    const [drawEnabled, setDrawEnabled] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);

    const selectedDefinition = tools.find(
        (tool): tool is TToolItemDefinition => isToolItemDefinition(tool) && tool.value === selectedTool
    );

    React.useEffect(() => {
        controlsRef.current?.setKeepPlacingAfterComplete(keepPlacing);
    }, [keepPlacing]);

    React.useEffect(() => {
        if (!isReady) return;
        if (drawEnabled && selectedDefinition) {
            controlsRef.current?.startTool(selectedDefinition.annotationType, selectedDefinition.options);
        } else {
            controlsRef.current?.stopActiveTools();
        }
    }, [drawEnabled, isReady, selectedDefinition]);

    React.useEffect(
        () => () => {
            controlsRef.current?.dispose();
        },
        []
    );

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow} style={{ gap: 8, alignItems: "center" }}>
                <FormControl size="small" sx={{ width: 160, flexShrink: 0 }}>
                    <Select
                        value={selectedTool}
                        onChange={(event) => {
                            setSelectedTool(event.target.value);
                            setDrawEnabled(true);
                        }}
                        sx={{
                            color: "inherit",
                            "& .MuiSvgIcon-root": { color: "inherit" },
                            "& .MuiSelect-select": { paddingRight: "28px !important" },
                        }}
                        inputProps={{ MenuProps: { disableScrollLock: true } }}
                        renderValue={() => (
                            <span style={{ display: "inline-flex", alignItems: "center", maxWidth: 96 }}>
                                {selectedDefinition?.icon}
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {selectedDefinition?.label}
                                </span>
                            </span>
                        )}
                    >
                        {tools.map((tool, index) => {
                            if (!isToolItemDefinition(tool)) {
                                return (
                                    <hr
                                        key={`separator-${index}`}
                                        style={{ margin: "5px 0", borderColor: "rgba(0,0,0,0.2)" }}
                                    />
                                );
                            }
                            return (
                                <MenuItem key={tool.value} value={tool.value}>
                                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                                        {tool.icon}
                                        {tool.label}
                                    </span>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <ToggleButton
                    size="small"
                    color="primary"
                    value="draw"
                    selected={drawEnabled}
                    onClick={() => setDrawEnabled((value) => !value)}
                >
                    <EditIcon fontSize="small" style={{ marginRight: 6 }} />
                    Draw
                </ToggleButton>

                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={keepPlacing}
                            onChange={(event) => setKeepPlacing(event.target.checked)}
                        />
                    }
                    label="Keep drawing"
                    sx={{ marginLeft: 0, marginRight: 0 }}
                />

                <span style={{ flex: 1 }} />

                <IconButton
                    size="small"
                    color="primary"
                    title="Duplicate selected annotation"
                    aria-label="Duplicate selected annotation"
                    onClick={() => controlsRef.current?.duplicateSelectedAnnotation()}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="primary"
                    title="Delete selected annotation"
                    aria-label="Delete selected annotation"
                    onClick={() => controlsRef.current?.removeSelectedAnnotations()}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="primary"
                    title="Reset annotations"
                    aria-label="Reset annotations"
                    onClick={() => controlsRef.current?.resetAnnotations()}
                >
                    <RestartAltIcon fontSize="small" />
                </IconButton>
            </div>

            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                    result.setKeepPlacingAfterComplete(keepPlacing);
                    setIsReady(true);
                }}
            />
        </div>
    );
}
