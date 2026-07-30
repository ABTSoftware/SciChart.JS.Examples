import * as React from "react";
import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

const POINT_OPTIONS = [3, 5, 7, 9];

const toolbarStyle: React.CSSProperties = {
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    padding: "6px 12px",
};

const controlGroupSx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 1,
};

const pointToggleSx: SxProps<Theme> = {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: "8px",
    "& .MuiToggleButton-root": {
        minWidth: 36,
        minHeight: 28,
        color: "inherit",
        borderColor: "rgba(255, 255, 255, 0.18)",
        px: 1.35,
        py: 0.25,
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 1.3,
        textTransform: "none",
    },
    "& .MuiToggleButton-root.Mui-selected": {
        color: "#ffffff",
        backgroundColor: "rgba(14, 165, 233, 0.75)",
    },
    "& .MuiToggleButton-root.Mui-selected:hover": {
        backgroundColor: "rgba(14, 165, 233, 0.9)",
    },
};

const connectorButtonSx: SxProps<Theme> = {
    minWidth: "auto",
    minHeight: 28,
    borderColor: "rgba(255, 255, 255, 0.18)",
    color: "#ffffff",
    padding: 0.25,
    px: 0.9,
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.3,
    textTransform: "none",
    "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.35)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
};

const deleteButtonSx: SxProps<Theme> = {
    width: 28,
    height: 28,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    color: "#ffffff",
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.75)" },
};

const actionGroupSx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    gap: 3,
    ml: "auto",
};

export default function PairedDashedPolylineAnnotation() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [pointCount, setPointCount] = React.useState(5);

    const handlePointCountChange = React.useCallback(
        (_event: React.MouseEvent<HTMLElement>, nextPointCount: number | null) => {
            if (!nextPointCount) return;

            setPointCount(nextPointCount);
            controlsRef.current?.startPlacement(nextPointCount);
        },
        []
    );

    return (
        <div className={commonClasses.ChartWithToolbar} style={{ position: "relative" }}>
            <div className={commonClasses.ToolbarRow} style={toolbarStyle}>
                <Box sx={controlGroupSx}>
                    <Typography component="span" sx={{ fontSize: "1rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                        Place polyline with N points: 
                    </Typography>

                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={pointCount}
                        onChange={handlePointCountChange}
                        aria-label="Polyline point count"
                        sx={pointToggleSx}
                    >
                        {POINT_OPTIONS.map((count) => (
                            <ToggleButton key={count} value={count} aria-label={`${count} points`}>
                                {count}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <Box sx={actionGroupSx}>
                    <Tooltip title="Toggle connector lines" arrow>
                        <Button
                            variant="outlined"
                            size="small"
                            aria-label="Toggle connector lines"
                            onClick={() => controlsRef.current?.togglePairConnectors()}
                            sx={connectorButtonSx}
                        >
                            Toggle lines
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete all annotations" placement="right" arrow>
                        <IconButton
                            size="small"
                            aria-label="Delete all annotations"
                            onClick={() => controlsRef.current?.deleteAllAnnotations()}
                            sx={deleteButtonSx}
                        >
                            <DeleteSweepIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </div>

            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                }}
            />
        </div>
    );
}
