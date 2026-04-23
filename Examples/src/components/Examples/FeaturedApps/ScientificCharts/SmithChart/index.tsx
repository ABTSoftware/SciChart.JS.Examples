import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FloatingPanel } from "../../../FloatingPanel";
import { drawExample } from "./drawExample";
import { useSmithChart, SmithState, GammaPoint, ComponentType, DragMode } from "./useSmithChart";
import { SmithChartResistanceAxis } from "./smithChartAxes";
import { computeReadouts } from "./smithChartMarkers";
import { CHAIN_COLOURS } from "./smithChartChain";
import { SCENARIOS, Scenario } from "./smithChartScenarios";
import { SciChartSurface } from "scichart";
import { smithGridConfig, updateSmithGridConfig } from "./smithChartGridCalculator";

const COLOURS = ["#FF4444", "#44AAFF", "#FFAA00", "#44FF88", "#FF44CC", "#88FF44"];

const ROW: React.CSSProperties = { display: "flex", flexDirection: "row", alignItems: "center", gap: 8 };
const WRAP_ROW: React.CSSProperties = { ...ROW, flexWrap: "wrap" };

export default function SmithChartComponent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [state, dispatch] = useSmithChart();
    const chartRef = React.useRef<HTMLDivElement>(null);
    const chartApiRef = React.useRef<{
        update: (s: SmithState) => void;
        getChainTip: (s: SmithState) => GammaPoint | null;
        addChainStep: (from: GammaPoint, type: ComponentType, value: number, freq: number) => void;
        setDispatch: (d: any) => void;
        sciChartSurface: SciChartSurface;
    } | null>(null);
    const stateRef = React.useRef(state);
    stateRef.current = state;

    const loadScenario = React.useCallback((scenario: Scenario) => {
        const api = chartApiRef.current;
        if (!api) return;
        dispatch({ type: "CLEAR" });
        for (const step of scenario.steps) {
            step.run(dispatch, api.addChainStep);
        }
        dispatch({
            type: "LOAD_SCENARIO",
            id: scenario.id,
            steps: scenario.steps.map((s) => s.description),
        });
    }, []);

    const [chainType, setChainType] = React.useState<ComponentType>("seriesL");
    const [chainValue, setChainValue] = React.useState("1e-9");

    const [chainOpen, setChainOpen] = React.useState(false);
    const [gridOpen, setGridOpen] = React.useState(false);
    const [examplesAnchor, setExamplesAnchor] = React.useState<null | HTMLElement>(null);

    // Grid config — mirrors smithGridConfig for controlled inputs
    const [gridCfg, setGridCfg] = React.useState({
        majorPxThreshold: smithGridConfig.majorPxThreshold,
        minorPxThreshold: smithGridConfig.minorPxThreshold,
        targetTicks: smithGridConfig.targetTicks,
        useCompactRange: smithGridConfig.useCompactRange,
        maxTiers: smithGridConfig.maxTiers,
        minGapPx: smithGridConfig.minGapPx,
    });
    const applyGridCfg = React.useCallback(
        (patch: Partial<typeof gridCfg>) => {
            const next = { ...gridCfg, ...patch };
            setGridCfg(next);
            updateSmithGridConfig(next);
            chartApiRef.current?.sciChartSurface?.invalidateElement();
        },
        [gridCfg]
    );

    // Rim config — angular spacing and label gap for the angle-of-Γ ring
    const [rimCfg, setRimCfg] = React.useState({
        majorTickStep: 30,
        minorTickStep: 10,
        labelOffset: 2,
    });
    const applyRimCfg = React.useCallback(
        (patch: Partial<typeof rimCfg>) => {
            const next = { ...rimCfg, ...patch };
            setRimCfg(next);
            const axis = chartApiRef.current?.sciChartSurface?.xAxes?.get(0) as SmithChartResistanceAxis | undefined;
            if (axis) {
                axis.rimConfig = { ...axis.rimConfig, ...patch };
                chartApiRef.current?.sciChartSurface?.invalidateElement();
            }
        },
        [rimCfg]
    );

    // Init chart once on mount
    React.useEffect(() => {
        let surface: SciChartSurface | undefined;
        drawExample(chartRef.current!).then((result) => {
            result.setDispatch(dispatch);
            chartApiRef.current = result;
            surface = result.sciChartSurface;
            chartApiRef.current.update(stateRef.current);
        });
        return () => {
            surface?.delete();
        };
    }, []);

    // Sync state changes to SciChart
    React.useEffect(() => {
        chartApiRef.current?.update(state);
    }, [state]);

    return (
        <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column" }}>
            {/* On desktop: row layout with container query sizing. On mobile: column layout. */}
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                    flexDirection: isMobile ? "column" : "row",
                    ...(isMobile ? {} : ({ containerType: "size" } as React.CSSProperties)),
                }}
            >
                {/* Wrapper: positions the chart canvas + overlay buttons + floating panels */}
                <div
                    style={
                        isMobile
                            ? { position: "relative", width: "100%", aspectRatio: "1 / 1", flexShrink: 0 }
                            : {
                                  position: "relative",
                                  aspectRatio: "1 / 1",
                                  width: "min(calc(100cqw - 260px), 100cqh)",
                                  height: "auto",
                                  flexShrink: 0,
                                  alignSelf: "flex-start",
                              }
                    }
                >
                    {/* Chart canvas */}
                    <div
                        ref={chartRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                            touchAction: "none",
                        }}
                    />

                    {/* Overlay buttons — top-left of chart */}
                    <div
                        style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            zIndex: 10,
                        }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => setExamplesAnchor(e.currentTarget)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                        >
                            Examples
                        </Button>
                        <Button
                            size="small"
                            variant={chainOpen ? "contained" : "outlined"}
                            onClick={() => setChainOpen((v) => !v)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                        >
                            Chain
                        </Button>
                        <Button
                            size="small"
                            variant={gridOpen ? "contained" : "outlined"}
                            onClick={() => setGridOpen((v) => !v)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                        >
                            Grid
                        </Button>
                    </div>

                    {/* Examples dropdown menu */}
                    <Menu
                        anchorEl={examplesAnchor}
                        open={Boolean(examplesAnchor)}
                        onClose={() => setExamplesAnchor(null)}
                    >
                        {SCENARIOS.map((scenario) => (
                            <MenuItem
                                key={scenario.id}
                                selected={state.activeScenarioId === scenario.id}
                                onClick={() => {
                                    loadScenario(scenario);
                                    setExamplesAnchor(null);
                                }}
                                style={{ fontSize: 12 }}
                            >
                                {scenario.title}
                            </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                dispatch({ type: "CLEAR" });
                                setExamplesAnchor(null);
                            }}
                            style={{ fontSize: 12 }}
                        >
                            Clear
                        </MenuItem>
                    </Menu>

                    {/* Chain floating panel */}
                    <FloatingPanel
                        title="Chain"
                        open={chainOpen}
                        onClose={() => setChainOpen(false)}
                        defaultPosition={{ x: 8, y: 110 }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {/* VSWR */}
                            <div style={ROW}>
                                <Tooltip
                                    title="VSWR = (1+|Γ|)/(1−|Γ|) — drag the orange handle on the real axis to resize the circle"
                                    placement="top"
                                >
                                    <Typography variant="caption" style={{ cursor: "default" }}>
                                        VSWR:
                                    </Typography>
                                </Tooltip>
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
                                <Tooltip
                                    title="Fill the VSWR circle interior to mark the acceptable match region"
                                    placement="top"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={state.vswrShaded}
                                                onChange={(e) =>
                                                    dispatch({ type: "SET_VSWR_SHADED", shaded: e.target.checked })
                                                }
                                            />
                                        }
                                        label={<Typography variant="caption">Shade</Typography>}
                                    />
                                </Tooltip>
                                <Tooltip title="Show or hide the dashed VSWR circle outline" placement="top">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={state.vswrOutline}
                                                onChange={(e) =>
                                                    dispatch({ type: "SET_VSWR_OUTLINE", outline: e.target.checked })
                                                }
                                            />
                                        }
                                        label={<Typography variant="caption">Outline</Typography>}
                                    />
                                </Tooltip>
                            </div>

                            <Divider />

                            {/* Chain builder */}
                            <div style={WRAP_ROW}>
                                <Tooltip
                                    title="Operating frequency for reactive components (L, C) and transmission lines"
                                    placement="top"
                                >
                                    <Typography variant="caption" style={{ cursor: "default" }}>
                                        Freq:
                                    </Typography>
                                </Tooltip>
                                <TextField
                                    size="small"
                                    type="number"
                                    value={(state.frequency / 1e9).toFixed(3)}
                                    inputProps={{ min: 0.001, max: 100, step: 0.1, style: { width: 60, fontSize: 12 } }}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        if (v > 0) dispatch({ type: "SET_FREQUENCY", frequency: v * 1e9 });
                                    }}
                                />
                                <Typography variant="caption">GHz</Typography>
                                <Tooltip
                                    title="Component type: series elements move along constant-R or constant-X curves; shunt elements move along constant-G or constant-B curves; TL rotates clockwise at constant |Γ|"
                                    placement="top"
                                >
                                    <Select
                                        value={chainType}
                                        onChange={(e) => setChainType(e.target.value as ComponentType)}
                                        style={{ fontSize: 12, minWidth: 100 }}
                                    >
                                        {(
                                            [
                                                ["seriesL", "Series L"],
                                                ["seriesC", "Series C"],
                                                ["seriesR", "Series R"],
                                                ["shuntL", "Shunt L"],
                                                ["shuntC", "Shunt C"],
                                                ["shuntR", "Shunt R"],
                                                ["TL", "Trans. Line"],
                                            ] as [ComponentType, string][]
                                        ).map(([v, l]) => (
                                            <MenuItem key={v} value={v} style={{ fontSize: 12 }}>
                                                {l}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        chainType === "TL"
                                            ? "Transmission line length in wavelengths (e.g. 0.25 = quarter-wave)"
                                            : "Component value — Henrys (L), Farads (C), or Ohms (R)"
                                    }
                                    placement="top"
                                >
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={chainValue}
                                        inputProps={{ style: { width: 70, fontSize: 12 } }}
                                        onChange={(e) => setChainValue(e.target.value)}
                                        placeholder={chainType === "TL" ? "λ" : "SI"}
                                    />
                                </Tooltip>
                                <Tooltip title="Append this component step from the current chain tip" placement="top">
                                    <span>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                const tip = chartApiRef.current?.getChainTip(state);
                                                if (!tip) return;
                                                const parsed = parseFloat(chainValue);
                                                if (isNaN(parsed)) return;
                                                chartApiRef.current?.addChainStep(
                                                    tip,
                                                    chainType,
                                                    parsed,
                                                    state.frequency
                                                );
                                            }}
                                            disabled={!chartApiRef.current?.getChainTip(state)}
                                        >
                                            Add
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Remove the last chain step" placement="top">
                                    <span>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => dispatch({ type: "UNDO_CHAIN_STEP" })}
                                            disabled={state.chain.length === 0}
                                        >
                                            Undo
                                        </Button>
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    </FloatingPanel>

                    {/* Grid Config floating panel */}
                    <FloatingPanel
                        title="Grid Config"
                        open={gridOpen}
                        onClose={() => setGridOpen(false)}
                        defaultPosition={{ x: 280, y: 110 }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {/* Z/Y/ZY grid mode */}
                            <div style={ROW}>
                                <Typography variant="caption">Grid:</Typography>
                                <ToggleButtonGroup
                                    size="small"
                                    value={state.gridMode}
                                    exclusive
                                    onChange={(_: any, v: any) => v && dispatch({ type: "SET_GRID_MODE", mode: v })}
                                >
                                    <Tooltip
                                        title="Impedance grid — constant-R circles and constant-X arcs"
                                        placement="top"
                                    >
                                        <ToggleButton value="Z">Z</ToggleButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Admittance grid — constant-G circles and constant-B arcs"
                                        placement="top"
                                    >
                                        <ToggleButton value="Y">Y</ToggleButton>
                                    </Tooltip>
                                    <Tooltip title="Both impedance and admittance grids overlaid" placement="top">
                                        <ToggleButton value="ZY">ZY</ToggleButton>
                                    </Tooltip>
                                </ToggleButtonGroup>
                            </div>

                            {/* Z opacity */}
                            {(state.gridMode === "Z" || state.gridMode === "ZY") && (
                                <Tooltip title="Impedance grid opacity" placement="top">
                                    <div style={{ ...ROW, minWidth: 200 }}>
                                        <Typography variant="caption">Z α:</Typography>
                                        <Slider
                                            value={state.zOpacity}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            onChange={(_: any, v: any) =>
                                                dispatch({ type: "SET_Z_OPACITY", opacity: v as number })
                                            }
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </Tooltip>
                            )}

                            {/* Y opacity */}
                            {(state.gridMode === "Y" || state.gridMode === "ZY") && (
                                <Tooltip title="Admittance grid opacity" placement="top">
                                    <div style={{ ...ROW, minWidth: 200 }}>
                                        <Typography variant="caption">Y α:</Typography>
                                        <Slider
                                            value={state.yOpacity}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            onChange={(_: any, v: any) =>
                                                dispatch({ type: "SET_Y_OPACITY", opacity: v as number })
                                            }
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </Tooltip>
                            )}

                            <Divider style={{ margin: "4px 0" }} />

                            <GridSlider
                                label="Major px"
                                min={5}
                                max={50}
                                step={1}
                                tooltip="Minimum pixel radius a circle/arc must have to qualify as a major gridline. Increase to show fewer, bolder major lines."
                                value={gridCfg.majorPxThreshold}
                                onChange={(v) => applyGridCfg({ majorPxThreshold: v })}
                            />
                            <GridSlider
                                label="Minor px"
                                min={1}
                                max={20}
                                step={1}
                                tooltip="Minimum pixel radius for a minor gridline. Circles smaller than this are hidden entirely. Increase to reduce clutter when zoomed out."
                                value={gridCfg.minorPxThreshold}
                                onChange={(v) => applyGridCfg({ minorPxThreshold: v })}
                            />
                            <GridSlider
                                label="Target ticks"
                                min={2}
                                max={16}
                                step={1}
                                tooltip="Desired number of major gridlines per family (R circles and X arcs). Values are chosen evenly-spaced in s-space (s = 1/(v+1)) to give perceptually uniform density."
                                value={gridCfg.targetTicks}
                                onChange={(v) => applyGridCfg({ targetTicks: v })}
                            />
                            <GridSlider
                                label="Max tiers (0=auto)"
                                min={0}
                                max={8}
                                step={1}
                                tooltip="Caps the number of binary subdivision passes used to fill minor ticks between majors. 0 = automatic (scales with the number of major ticks). More tiers = finer minor grid."
                                value={gridCfg.maxTiers}
                                onChange={(v) => applyGridCfg({ maxTiers: v })}
                            />
                            <GridSlider
                                label="Min gap (px)"
                                min={0.5}
                                max={10}
                                step={0.5}
                                tooltip="Target pixel gap between adjacent arc curves at the convergence point. Automatically scales with zoom (effectiveGap = minGapPx / pixPerUnit), so subdivision deepens as you zoom in. Higher = sparser grid; lower = denser."
                                value={gridCfg.minGapPx}
                                onChange={(v) => applyGridCfg({ minGapPx: v })}
                            />
                            <Tooltip
                                title="When enabled, suppresses minor-tick subdivision in the large-arc sweep region (circles whose centres lie outside the viewport). Reduces clutter on the left side when zoomed into the right half of the chart."
                                placement="left"
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={gridCfg.useCompactRange}
                                            onChange={(e) => applyGridCfg({ useCompactRange: e.target.checked })}
                                        />
                                    }
                                    label={<Typography variant="caption">Compact range</Typography>}
                                    style={{ margin: 0 }}
                                />
                            </Tooltip>
                            <Divider style={{ margin: "4px 0" }} />
                            <Typography
                                variant="caption"
                                style={{ fontWeight: 700, color: "color-mix(in srgb, var(--text) 55%, transparent)" }}
                            >
                                RIM
                            </Typography>
                            <GridSlider
                                label="Label gap"
                                min={1}
                                max={20}
                                step={1}
                                tooltip="Pixel gap between the outer tip of a major tick and the label anchor. Must be ≥ 1."
                                value={rimCfg.labelOffset}
                                onChange={(v) => applyRimCfg({ labelOffset: v })}
                            />
                            <GridSlider
                                label="Major °"
                                min={10}
                                max={90}
                                step={10}
                                tooltip="Angular spacing in degrees between major (labelled) rim ticks. Must be an integer multiple of the minor tick step."
                                value={rimCfg.majorTickStep}
                                onChange={(v) => applyRimCfg({ majorTickStep: v })}
                            />
                            <GridSlider
                                label="Minor °"
                                min={5}
                                max={30}
                                step={5}
                                tooltip="Angular spacing in degrees between minor rim ticks."
                                value={rimCfg.minorTickStep}
                                onChange={(v) => applyRimCfg({ minorTickStep: v })}
                            />
                        </div>
                    </FloatingPanel>
                </div>

                {/* Readout sidebar */}
                <div
                    style={{
                        width: isMobile ? "100%" : 260,
                        overflowY: "auto",
                        padding: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    {state.scenarioSteps.length > 0 && (
                        <>
                            <Typography variant="caption" style={{ fontWeight: 700, marginBottom: 4 }}>
                                HOW IT WORKS
                            </Typography>
                            {state.scenarioSteps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <Typography
                                        variant="caption"
                                        style={{
                                            color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                            flexShrink: 0,
                                            minWidth: 14,
                                        }}
                                    >
                                        {i + 1}.
                                    </Typography>
                                    <Typography variant="caption" style={{ lineHeight: 1.4 }}>
                                        {step}
                                    </Typography>
                                </div>
                            ))}
                            <Divider style={{ margin: "6px 0" }} />
                        </>
                    )}
                    <Typography variant="caption" style={{ fontWeight: 700, marginBottom: 4 }}>
                        MARKERS
                    </Typography>
                    {state.markers.length === 0 && (
                        <Typography
                            variant="caption"
                            style={{ color: "color-mix(in srgb, var(--text) 55%, transparent)" }}
                        >
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
                                sx={{
                                    border: `1px solid ${colour}`,
                                    bgcolor: "var(--bg-chart)",
                                    color: "var(--text)",
                                    "&:before": { display: "none" },
                                    "& .MuiAccordionSummary-root": { bgcolor: "var(--bg-chart)", color: "var(--text)" },
                                    "& .MuiAccordionDetails-root": { bgcolor: "var(--bg-chart)" },
                                    "& .MuiToggleButton-root": {
                                        color: "color-mix(in srgb, var(--text) 60%, transparent)",
                                        borderColor: "color-mix(in srgb, var(--text) 25%, transparent)",
                                    },
                                    "& .MuiToggleButton-root.Mui-selected": {
                                        bgcolor: "color-mix(in srgb, var(--text) 15%, transparent)",
                                        color: "var(--text)",
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    style={{ minHeight: 32, padding: "0 8px" }}
                                >
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: "REMOVE_MARKER", id: marker.id });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.stopPropagation();
                                                dispatch({ type: "REMOVE_MARKER", id: marker.id });
                                            }
                                        }}
                                        style={{
                                            marginRight: 4,
                                            padding: 2,
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </span>
                                    <Chip
                                        label={marker.label}
                                        size="small"
                                        style={{
                                            backgroundColor: colour,
                                            color: "#fff",
                                            marginRight: 8,
                                            fontSize: 11,
                                        }}
                                    />
                                    <Typography variant="caption" style={{ fontFamily: "monospace", lineHeight: 2 }}>
                                        Γ={marker.gamma.re.toFixed(3)}
                                        {marker.gamma.im >= 0 ? "+" : ""}j{marker.gamma.im.toFixed(3)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    style={{ padding: 8, flexDirection: "column", alignItems: "stretch" }}
                                >
                                    <div style={{ ...ROW, marginBottom: 6 }}>
                                        <Typography
                                            variant="caption"
                                            style={{
                                                color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                                minWidth: 36,
                                            }}
                                        >
                                            Drag:
                                        </Typography>
                                        <ToggleButtonGroup
                                            size="small"
                                            value={marker.dragMode}
                                            exclusive
                                            onChange={(_: any, v: any) =>
                                                v &&
                                                dispatch({
                                                    type: "SET_DRAG_MODE",
                                                    id: marker.id,
                                                    mode: v as DragMode,
                                                })
                                            }
                                        >
                                            {(["free", "gamma", "R", "X", "G", "B"] as DragMode[]).map((m) => (
                                                <ToggleButton
                                                    key={m}
                                                    value={m}
                                                    style={{ padding: "1px 5px", fontSize: 10, lineHeight: 1.4 }}
                                                >
                                                    {m === "free" ? "Free" : m === "gamma" ? "|Γ|" : m}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    </div>
                                    <ReadoutTable ro={ro} />
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}

                    {/* Chain step list */}
                    {state.chain.length > 0 && (
                        <>
                            <Divider style={{ margin: "4px 0" }} />
                            <Typography variant="caption" style={{ fontWeight: 700 }}>
                                CHAIN ({state.chain.length} steps)
                            </Typography>
                            {state.chain.map((step, i) => (
                                <div key={step.id} style={ROW}>
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: CHAIN_COLOURS[i % CHAIN_COLOURS.length],
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography variant="caption" style={{ fontFamily: "monospace" }}>
                                        {step.type} {step.value.toExponential(2)}
                                        {" → "}Γ={step.toGamma.re.toFixed(3)}
                                        {step.toGamma.im >= 0 ? "+" : ""}j{step.toGamma.im.toFixed(3)}
                                    </Typography>
                                </div>
                            ))}
                            {(state.markers.find((m) => m.isChainStart) || state.chainStartGamma) && (
                                <Typography
                                    variant="caption"
                                    style={{ color: "color-mix(in srgb, var(--text) 55%, transparent)" }}
                                >
                                    Start:{" "}
                                    {(() => {
                                        const m = state.markers.find((m) => m.isChainStart);
                                        if (m) return m.label;
                                        const g = state.chainStartGamma!;
                                        return `Γ=(${g.re.toFixed(3)},${g.im.toFixed(3)})`;
                                    })()}
                                </Typography>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function GridSlider({
    label,
    tooltip,
    min,
    max,
    step,
    value,
    onChange,
    format,
}: {
    label: string;
    tooltip?: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
}) {
    const inner = (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Typography variant="caption" style={{ minWidth: 76, flexShrink: 0 }}>
                {label}:
            </Typography>
            <Slider
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(_: any, v: any) => onChange(v as number)}
                style={{ flex: 1 }}
            />
            <Typography variant="caption" style={{ minWidth: 36, textAlign: "right", fontFamily: "monospace" }}>
                {format ? format(value) : value}
            </Typography>
        </div>
    );
    return tooltip ? (
        <Tooltip title={tooltip} placement="left">
            {inner}
        </Tooltip>
    ) : (
        inner
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
        <table style={{ width: "100%", fontSize: 11, fontFamily: "monospace", borderCollapse: "collapse" }}>
            <tbody>
                {rows.map(([label, value]) => (
                    <tr key={label}>
                        <td
                            style={{
                                color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                paddingRight: 8,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {label}
                        </td>
                        <td style={{ textAlign: "right" }}>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
