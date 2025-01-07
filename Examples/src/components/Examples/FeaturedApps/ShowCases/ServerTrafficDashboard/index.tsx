import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { CSSProperties, ChangeEventHandler, useEffect, useRef, useState } from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { ChartModifierBase2D, SciChartSubSurface } from "scichart";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { ModifierGroup } from "./ModifierGroup";
import { createRegionStatisticsPieChart, getRegionStatisticsColumnChartConfig } from "./region-statistic-charts";
import { getMainChartConfig } from "./main-chart-config";

import { overviewOptions } from "./Overview";
import ThresholdSlider from "./ThresholdSlider";
import { SciChartReact as SciChart, SciChartNestedOverview } from "scichart-react";
import { appTheme } from "../../../theme";
import { Dialog, DialogTitle, FormControlLabel, IconButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { getPageStatisticsChartConfig } from "./page-statistics-chart-config";
import { getServerLoadChartConfig } from "./server-load-chart-config";
import { ChartGroupLoader } from "../../../ChartGroupLoader";
import type {
    TPageStatsConfigFuncResult,
    TServerStatsChartConfigFuncResult,
    TMainChartConfigFuncResult,
} from "./chart-types";
import { afterAllChartsInit } from "./after-all-charts-init";
import { VisibleRangeSynchronizationManager } from "./VisibleRangeSynchronizationManager";
import { useViewType } from "../../../../../helpers/shared/hooks/containerSizeHooks";

function ServerTrafficDashboard() {
    const ref = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(ref);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    const [isVisibleRangeSynced, setIsVisibleRangeSynced] = useState(true);
    const [isHundredPercentCollection, setIsHundredPercentCollection] = useState(false);
    const [isGridLayout, setIsGridLayout] = useState(false);

    const pageStatisticChartRef = useRef<TPageStatsConfigFuncResult>(null);
    const serverLoadChartRef = useRef<TServerStatsChartConfigFuncResult>(null);
    const gridLayoutModifierRef = useRef<GridLayoutModifier>(null);

    const [modifierGroup] = useState(new ModifierGroup());
    const [axisSyncManager] = useState(new VisibleRangeSynchronizationManager());

    useEffect(() => {
        return () => {
            pageStatisticChartRef.current = undefined;
            serverLoadChartRef.current = undefined;
            gridLayoutModifierRef.current = undefined;
        };
    }, []);

    const onMainChartInit = (initResult: TMainChartConfigFuncResult) => {
        const sciChartSurface = initResult.sciChartSurface;
        const modifier = sciChartSurface.chartModifiers.getById("TotalRequestsCursorModifier");
        const rollover = sciChartSurface.chartModifiers.getById("TotalRequestsRolloverModifier");
        modifierGroup.add(modifier as ChartModifierBase2D, rollover as ChartModifierBase2D);
    };

    const onPageStatisticsChartInit = (initResult: TPageStatsConfigFuncResult) => {
        pageStatisticChartRef.current = initResult;
        const sciChartSurface = initResult.sciChartSurface;
        const modifier = sciChartSurface.chartModifiers.getById("PageStatisticsRolloverModifier");
        modifierGroup.add(modifier as ChartModifierBase2D);
    };

    const onServerLoadChartInit = (initResult: TServerStatsChartConfigFuncResult) => {
        serverLoadChartRef.current = initResult;
        const sciChartSurface = initResult.sciChartSurface;

        gridLayoutModifierRef.current = sciChartSurface.chartModifiers.getById(
            "GridLayoutModifier"
        ) as GridLayoutModifier;

        const modifier = sciChartSurface.chartModifiers.getById("ServerLoadCursorModifier");
        modifierGroup.add(modifier as ChartModifierBase2D);
    };

    const handleSyncVisibleRangeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        axisSyncManager.enabled = !axisSyncManager.enabled;
        setIsVisibleRangeSynced(!isVisibleRangeSynced);
    };

    const handleUsePercentage: ChangeEventHandler<HTMLInputElement> = (e) => {
        pageStatisticChartRef.current.toggleIsHundredPercent();
        setIsHundredPercentCollection(!isHundredPercentCollection);
    };

    const handleUseGridLayout: ChangeEventHandler<HTMLInputElement> = (e) => {
        gridLayoutModifierRef.current.isGrid = !isGridLayout;
        const subCharts = serverLoadChartRef.current.sciChartSurface.subCharts;

        if (!isGridLayout) {
            serverLoadChartRef.current.sciChartSurface.titleStyle.color = "transparent";

            subCharts.forEach((subChart: SciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.add(modifier as ChartModifierBase2D);
            });
        } else {
            serverLoadChartRef.current.sciChartSurface.titleStyle.color = appTheme.ForegroundColor;

            subCharts.forEach((subChart: SciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.remove(modifier as ChartModifierBase2D);
            });
        }

        setIsGridLayout(!isGridLayout);
    };

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const configurationDialog = (
        <Dialog onClose={handleClose} open={isDialogOpen}>
            <DialogTitle>
                Chart Configurations
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <List>
                <Typography variant="subtitle2" fontWeight={"bold"} sx={{ padding: "0em 1em" }}>
                    Main Chart
                </Typography>

                <ListItem disablePadding>
                    <FormControlLabel
                        control={<Switch checked={isVisibleRangeSynced} onChange={handleSyncVisibleRangeChange} />}
                        label="Sync&nbsp;X-Axis&nbsp;visible&nbsp;range"
                        sx={{
                            margin: 0,
                            padding: "1em",
                            color: "#17243d",
                            accentColor: "#0bdef4",
                            marginRight: 4,
                        }}
                    />
                </ListItem>
                <Typography variant="subtitle2" fontWeight={"bold"} sx={{ padding: "0em 1em" }}>
                    URL Statistics Chart
                </Typography>
                <ListItem disablePadding>
                    <FormControlLabel
                        control={<Switch checked={isHundredPercentCollection} onChange={handleUsePercentage} />}
                        label="is&nbsp;100%&nbsp;collection"
                        sx={{
                            margin: 0,
                            padding: "1em",
                            color: "#17243d",
                            accentColor: "#0bdef4",
                            marginRight: 4,
                        }}
                    />
                </ListItem>
                <Typography variant="subtitle2" fontWeight={"bold"} sx={{ padding: "0em 1em" }}>
                    Server Load Statistics Chart
                </Typography>
                <ListItem disablePadding>
                    <FormControlLabel
                        control={<Switch checked={isGridLayout} onChange={handleUseGridLayout} />}
                        label="is&nbsp;Grid&nbsp;Layout"
                        sx={{
                            margin: 0,
                            padding: "1em",
                            color: "#17243d",
                            accentColor: "#0bdef4",
                            marginRight: 4,
                        }}
                    />
                </ListItem>
            </List>
        </Dialog>
    );

    return (
        <div ref={ref} className={commonClasses.ChartWrapper} style={{ backgroundColor: "#242529" }}>
            {viewInfo ? ( // checks if container was measured
                <ChartGroupLoader style={gridStyle} onInit={afterAllChartsInit(axisSyncManager)}>
                    <div style={configButtonWrapperStyle} title="Chart Configurations">
                        <IconButton
                            sx={{ color: appTheme.ForegroundColor, pointerEvents: "all", touchAction: "all" }}
                            onClick={handleClickOpen}
                        >
                            <SettingsIcon />
                        </IconButton>
                        {configurationDialog}
                    </div>

                    <SciChart
                        initChart={getMainChartConfig(viewInfo)}
                        onInit={onMainChartInit}
                        style={mainChartStyle}
                        innerContainerProps={innerContainerProps}
                    >
                        {!isMobileView ? <ThresholdSlider /> : null}
                        <SciChartNestedOverview style={overviewStyle} options={overviewOptions} />
                    </SciChart>

                    <SciChart
                        initChart={getPageStatisticsChartConfig(viewInfo)}
                        onInit={onPageStatisticsChartInit}
                        style={pageChartStyle}
                    />

                    <SciChart
                        initChart={getServerLoadChartConfig(viewInfo)}
                        onInit={onServerLoadChartInit}
                        style={serverChartStyle}
                    />

                    <SciChart initChart={getRegionStatisticsColumnChartConfig(viewInfo)} style={columnChartStyle} />

                    <SciChart initChart={createRegionStatisticsPieChart} style={pieChartStyle} />
                </ChartGroupLoader>
            ) : null}
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    boxSizing: "border-box",
    // padding: "0.5em",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "0.2em",
    gridTemplateRows: "repeat(8, 1fr)",
};

const mainChartStyle: CSSProperties = {
    gridRow: "1 / 4",
    gridColumn: "1/-1",
    position: "relative",
};

const innerContainerProps = {
    style: {
        height: "80%",
    },
};

const overviewStyle = {
    height: "20%",
};

const pageChartStyle = {
    gridRow: "4 / 7",
    gridColumn: "1 / 3",
};

const serverChartStyle = {
    gridRow: "4 / 7",
    gridColumn: "3 / -1",
};

const columnChartStyle = {
    gridRow: "7 / -1",
    gridColumn: "span 3",
};
const pieChartStyle = {
    gridRow: "7 / -1",
    gridColumn: "span 1",
};

const configButtonWrapperStyle: CSSProperties = {
    gridArea: "1 / 1 / 2 / 2",
    pointerEvents: "none",
    touchAction: "none",
    zIndex: 2,
};

export default ServerTrafficDashboard;
