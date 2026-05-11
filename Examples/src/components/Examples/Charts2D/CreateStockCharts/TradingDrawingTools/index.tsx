import * as React from "react";
import { IconButton, MenuItem, MenuList, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
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
    // {
    //     value: "fibonacci",
    //     annotationType: ETradingAnnotationType.FibonacciRetracementAnnotation,
    //     label: "Fibonacci Retracement",
    //     icon: icon(
    //         <>
    //             <line x1="4" y2="4" x2="16" y1="6" />
    //             <line x1="6" y2="9" x2="18" y1="11" />
    //             <line x1="8" y2="14" x2="20" y1="16" />
    //             <line x1="10" y2="19" x2="22" y1="21" />
    //         </>
    //     ),
    // },
    {
        value: "verticalFibonacci",
        annotationType: ETradingAnnotationType.FibonacciRetracementAnnotation,
        options: { verticalOnly: true },
        label: "Fibonacci Retracement",
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

export default function TradingDrawingTools() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const chartWrapperRef = React.useRef<HTMLDivElement>(null);
    const [selectedTool, setSelectedTool] = React.useState("");
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(
        () => () => {
            controlsRef.current?.dispose();
        },
        []
    );

    React.useEffect(() => {
        const wrapper = chartWrapperRef.current;
        if (!selectedTool || !wrapper) return undefined;
        const clear = () => setSelectedTool("");
        wrapper.addEventListener("mousedown", clear);
        return () => wrapper.removeEventListener("mousedown", clear);
    }, [selectedTool]);

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div
                    style={{
                        width: 200,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--bg-toolbars)",
                        color: "#ffffff",
                    }}
                >
                    <div
                        style={{
                            flexShrink: 0,
                            padding: "10px 16px",
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                            background: "var(--bg-toolbars)",
                        }}
                    >
                        Select Annotation
                    </div>
                    <MenuList
                        dense
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            padding: "4px 0",
                            "& .MuiMenuItem-root": {
                                color: "#ffffff",
                                borderLeft: "3px solid transparent",
                                transition: "background-color 120ms, border-color 120ms",
                            },
                            "& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected:hover, & .MuiMenuItem-root.Mui-selected:focus":
                                {
                                    backgroundColor: "#2D7FF9",
                                    borderLeftColor: "#FFFFFF",
                                    color: "#FFFFFF",
                                    fontWeight: 700,
                                },
                        }}
                    >
                    {tools.map((tool, index) => {
                        if (!isToolItemDefinition(tool)) {
                            return (
                                <hr
                                    key={`separator-${index}`}
                                    style={{ margin: "5px 8px", borderColor: "rgba(255,255,255,0.2)" }}
                                />
                            );
                        }
                        return (
                            <MenuItem
                                key={tool.value}
                                selected={tool.value === selectedTool}
                                onClick={() => {
                                    setSelectedTool(tool.value);
                                    if (isReady) {
                                        controlsRef.current?.startTool(tool.annotationType, tool.options);
                                    }
                                }}
                                title={tool.label}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: 0,
                                        width: "100%",
                                    }}
                                >
                                    {tool.icon}
                                    <span
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >
                                        {tool.label}
                                    </span>
                                </span>
                            </MenuItem>
                        );
                    })}
                </MenuList>
                </div>

                <div
                    ref={chartWrapperRef}
                    style={{ flex: 1, minWidth: 0, display: "flex", position: "relative" }}
                >
                    <SciChartReact
                        style={{ flex: 1 }}
                        initChart={drawExample}
                        onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                            controlsRef.current = result;
                            result.setKeepPlacingAfterComplete(false);
                            setIsReady(true);
                        }}
                    />
                    <Tooltip title="Delete all annotations" placement="right" arrow>
                        <IconButton
                            size="small"
                            aria-label="Delete all annotations"
                            onClick={() => controlsRef.current?.deleteAllAnnotations()}
                            sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                zIndex: 2,
                                backgroundColor: "rgba(0, 0, 0, 0.55)",
                                color: "#ffffff",
                                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.75)" },
                            }}
                        >
                            <DeleteSweepIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
