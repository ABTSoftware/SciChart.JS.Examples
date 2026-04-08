import * as React from "react";
import { useRef, useEffect } from "react";
import { SciChartReact } from "scichart-react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
    Slider,
    TextField,
    Checkbox,
    FormControlLabel,
    Stack,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { drawExample } from "./drawExample";
import { useSmithChart, SmithState } from "./useSmithChart";
import { computeReadouts } from "./smithChartMarkers";

const COLOURS = ["#FF4444", "#44AAFF", "#FFAA00", "#44FF88", "#FF44CC", "#88FF44"];

export default function SmithChartComponent() {
    const [state, dispatch] = useSmithChart();
    const updateRef = useRef<((s: SmithState) => void) | null>(null);

    useEffect(() => {
        updateRef.current?.(state);
    }, [state]);

    return (
        <Box sx={{ display: "flex", width: "100%", height: "100%", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <SciChartReact
                    initChart={drawExample}
                    onInit={(result: any) => {
                        result.setDispatch(dispatch);
                        updateRef.current = result.update;
                        updateRef.current(state);
                    }}
                    style={{
                        aspectRatio: "1 / 1",
                        width: "min(calc(100% - 260px), 100vh)",
                        height: "auto",
                        position: "relative",
                        overflow: "hidden",
                        touchAction: "none",
                        flexShrink: 0,
                    }}
                />

                <Box
                    sx={{
                        width: 260,
                        overflowY: "auto",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                    }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5 }}>
                        MARKERS
                    </Typography>
                    {state.markers.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Click chart to place a marker
                        </Typography>
                    )}
                    {state.markers.map((marker, i) => {
                        const ro = computeReadouts(marker.gamma);
                        const colour = COLOURS[i % COLOURS.length];
                        const isActive = marker.id === state.activeMarkerId;
                        return (
                            <Accordion
                                key={marker.id}
                                expanded={isActive}
                                onChange={() =>
                                    dispatch({ type: "SET_ACTIVE_MARKER", id: isActive ? null : marker.id })
                                }
                                disableGutters
                                sx={{ border: `1px solid ${colour}`, "&:before": { display: "none" } }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32, py: 0 }}>
                                    <Chip
                                        label={marker.label}
                                        size="small"
                                        sx={{ bgcolor: colour, color: "#fff", mr: 1, fontSize: 11 }}
                                    />
                                    <Typography variant="caption" sx={{ fontFamily: "monospace", lineHeight: 2 }}>
                                        Γ={marker.gamma.re.toFixed(3)}
                                        {marker.gamma.im >= 0 ? "+" : ""}j{marker.gamma.im.toFixed(3)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 1 }}>
                                    <ReadoutTable ro={ro} />
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            </Box>

            {/* Toolbar */}
            <Box
                sx={{
                    p: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {/* Z/Y/ZY grid mode toggle */}
                <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="caption">Grid:</Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={state.gridMode}
                        exclusive
                        onChange={(_, v) => v && dispatch({ type: "SET_GRID_MODE", mode: v })}
                    >
                        <ToggleButton value="Z">Z</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="ZY">ZY</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                {/* Z opacity slider — only when Z grid is visible */}
                {(state.gridMode === "Z" || state.gridMode === "ZY") && (
                    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                        <Typography variant="caption">Z α:</Typography>
                        <Slider
                            size="small"
                            value={state.zOpacity}
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={(_, v) => dispatch({ type: "SET_Z_OPACITY", opacity: v as number })}
                            sx={{ width: 80 }}
                        />
                    </Stack>
                )}

                {/* Y opacity slider — only when Y grid is visible */}
                {(state.gridMode === "Y" || state.gridMode === "ZY") && (
                    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                        <Typography variant="caption">Y α:</Typography>
                        <Slider
                            size="small"
                            value={state.yOpacity}
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={(_, v) => dispatch({ type: "SET_Y_OPACITY", opacity: v as number })}
                            sx={{ width: 80 }}
                        />
                    </Stack>
                )}

                <Divider orientation="vertical" flexItem />

                {/* VSWR circle numeric input + shade toggle */}
                <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="caption">VSWR:</Typography>
                    <TextField
                        size="small"
                        type="number"
                        value={state.vswr.toFixed(2)}
                        inputProps={{ min: 1.01, max: 100, step: 0.1, style: { width: 60, fontSize: 12 } }}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            if (v > 1) dispatch({ type: "SET_VSWR", vswr: v });
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={state.vswrShaded}
                                onChange={(e) => dispatch({ type: "SET_VSWR_SHADED", shaded: e.target.checked })}
                            />
                        }
                        label={<Typography variant="caption">Shade</Typography>}
                    />
                </Stack>
            </Box>
        </Box>
    );
}

function ReadoutTable({ ro }: { ro: ReturnType<typeof computeReadouts> }) {
    const rows: [string, string][] = [
        ["|Γ|", ro.gammaMag.toFixed(4)],
        ["∠Γ", `${ro.gammaAngleDeg.toFixed(2)}°`],
        ["Z", `${ro.zr.toFixed(3)} ${ro.zx >= 0 ? "+" : "−"} j${Math.abs(ro.zx).toFixed(3)}`],
        ["Y", `${ro.gy.toFixed(3)} ${ro.by >= 0 ? "+" : "−"} j${Math.abs(ro.by).toFixed(3)}`],
        ["VSWR", isFinite(ro.vswr) ? ro.vswr.toFixed(3) : "∞"],
        ["RL", isFinite(ro.returnLoss) ? `${ro.returnLoss.toFixed(2)} dB` : "∞"],
        ["ML", isFinite(ro.mismatchLoss) ? `${ro.mismatchLoss.toFixed(3)} dB` : "∞"],
        ["Q", isFinite(ro.q) ? ro.q.toFixed(3) : "∞"],
        ["WTG", ro.wtg.toFixed(4) + " λ"],
        ["WTL", ro.wtl.toFixed(4) + " λ"],
    ];
    return (
        <Box
            component="table"
            sx={{ width: "100%", fontSize: 11, fontFamily: "monospace", borderCollapse: "collapse" }}
        >
            <tbody>
                {rows.map(([label, value]) => (
                    <tr key={label}>
                        <td style={{ color: "#888", paddingRight: 8, whiteSpace: "nowrap" }}>{label}</td>
                        <td style={{ textAlign: "right" }}>{value}</td>
                    </tr>
                ))}
            </tbody>
        </Box>
    );
}
