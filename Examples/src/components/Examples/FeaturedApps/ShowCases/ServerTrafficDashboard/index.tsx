import "./styles.css";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { SettingsIcon, CloseIcon } from "../../../icons";
import { BodyPortal } from "../../../Portal";
import { ChartModifierBase2D, ISciChartSubSurface } from "scichart";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { ModifierGroup } from "./ModifierGroup";
import { createRegionStatisticsPieChart, getRegionStatisticsColumnChartConfig } from "./region-statistic-charts";
import { getMainChartConfig } from "./main-chart-config";

import { overviewOptions } from "./Overview";
import ThresholdSlider from "./ThresholdSlider";
import { SciChartReact as SciChart, SciChartNestedOverview } from "scichart-react";
import { appTheme } from "../../../theme";
import { getPageStatisticsChartConfig } from "./page-statistics-chart-config";
import { getServerLoadChartConfig } from "./server-load-chart-config";
import { ChartGroupLoader } from "scichart-react";
import type {
    TPageStatsConfigFuncResult,
    TServerStatsChartConfigFuncResult,
    TMainChartConfigFuncResult,
} from "./chart-types";
import { afterAllChartsInit } from "./after-all-charts-init";
import { VisibleRangeSynchronizationManager } from "./VisibleRangeSynchronizationManager";
import { useViewType } from "../../../containerSizeHooks";

function ServerTrafficDashboard() {
    const ref = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(ref);

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

            subCharts.forEach((subChart: ISciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.add(modifier as ChartModifierBase2D);
            });
        } else {
            serverLoadChartRef.current.sciChartSurface.titleStyle.color = appTheme.ForegroundColor;

            subCharts.forEach((subChart: ISciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.remove(modifier as ChartModifierBase2D);
            });
        }

        setIsGridLayout(!isGridLayout);
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const configurationDialog = isDialogOpen ? (
        <BodyPortal>
            <div
                className="sc-modal-backdrop"
                onClick={(event) => event.target === event.currentTarget && handleClose()}
                onKeyDown={(event) => event.key === "Escape" && handleClose()}
            >
                <section className="sc-modal" role="dialog" aria-modal="true" aria-labelledby="server-config-title">
                    <header className="sc-modal-header">
                        <strong id="server-config-title">Chart Configurations</strong>
                        <button
                            className="sc-button sc-button-icon"
                            aria-label="Close chart configurations"
                            onClick={handleClose}
                            autoFocus
                            type="button"
                        >
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="sc-modal-body">
                        <strong>Main Chart</strong>

                        <label className="sc-switch">
                            <input
                                type="checkbox"
                                checked={isVisibleRangeSynced}
                                onChange={handleSyncVisibleRangeChange}
                            />
                            Sync X-Axis visible range
                        </label>
                        <strong>URL Statistics Chart</strong>
                        <label className="sc-switch">
                            <input
                                type="checkbox"
                                checked={isHundredPercentCollection}
                                onChange={handleUsePercentage}
                            />
                            is 100% collection
                        </label>
                        <strong>Server Load Statistics Chart</strong>
                        <label className="sc-switch">
                            <input type="checkbox" checked={isGridLayout} onChange={handleUseGridLayout} />
                            is Grid Layout
                        </label>
                    </div>
                </section>
            </div>
        </BodyPortal>
    ) : null;

    return (
        <div ref={ref} className="sc-chart-wrapper sc-server-traffic">
            {viewInfo ? ( // checks if container was measured
                <ChartGroupLoader
                    className="h-full sc-server-traffic-grid"
                    onInit={afterAllChartsInit(axisSyncManager)}
                >
                    <div className="sc-server-traffic-settings m-1" title="Chart Configurations">
                        <button
                            className="sc-button sc-button-icon"
                            aria-label="Chart configurations"
                            onClick={handleClickOpen}
                            type="button"
                        >
                            <SettingsIcon fontSize="large" />
                        </button>
                        {configurationDialog}
                    </div>

                    <SciChart
                        initChart={getMainChartConfig(viewInfo)}
                        onInit={onMainChartInit}
                        className="relative sc-server-main-chart"
                        innerContainerProps={{ style: { height: "80%" } }}
                    >
                        <ThresholdSlider />
                        <SciChartNestedOverview style={{ height: "20%" }} options={overviewOptions} />
                    </SciChart>

                    <SciChart
                        initChart={getPageStatisticsChartConfig(viewInfo)}
                        onInit={onPageStatisticsChartInit}
                        className="sc-server-page-chart"
                    />

                    <SciChart
                        initChart={getServerLoadChartConfig(viewInfo)}
                        onInit={onServerLoadChartInit}
                        className="sc-server-load-chart"
                    />

                    <SciChart
                        initChart={getRegionStatisticsColumnChartConfig(viewInfo)}
                        className="sc-server-region-chart"
                    />

                    <SciChart initChart={createRegionStatisticsPieChart} className="sc-server-region-pie" />
                </ChartGroupLoader>
            ) : null}
        </div>
    );
}

export default ServerTrafficDashboard;
