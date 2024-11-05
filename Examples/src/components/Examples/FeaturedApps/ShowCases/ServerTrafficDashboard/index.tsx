import * as React from "react";
import { CSSProperties, ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { TChartConfigResult, synchronizeXVisibleRanges } from "./chart-configurations";
import {
    ChartModifierBase2D,
    NumberRange,
    SciChartPieSurface,
    SciChartSubSurface,
    SciChartSurface,
    easing,
} from "scichart";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { ModifierGroup } from "./ModifierGroup";
import {
    createRegionStatisticsColumnChart,
    createRegionStatisticsPieChart,
    TLocationStatsChartConfigFuncResult,
} from "./region-statistic-charts";
import { createMainChart } from "./main-chart-config";
import { TPageStatsConfigFuncResult, createPageStatisticsChart } from "./page-statistics-chart-config";
import { TServerStatsChartConfigFuncResult, createServerLoadChart } from "./server-load-chart-config";
import { TDataEntry, availableLocations, getData } from "./data-generation";
import { overviewOptions } from "./Overview";
import DashboardOverlay from "./DashboardOverlay";
import ThresholdSlider from "./ThresholdSlider";
import { IInitResult, SciChartReact as SciChart, SciChartGroup, SciChartNestedOverview } from "scichart-react";
import { appTheme } from "../../../theme";

function ServerTrafficDashboard() {
    const [isVisibleRangeSynced, setIsVisibleRangeSynced] = useState(true);
    const isVisibleRangeSyncedRef = useRef(true);
    const [isHundredPercentCollection, setIsHundredPercentCollection] = useState(false);
    const [isGridLayout, setIsGridLayout] = useState(false);

    const pageStatisticChartRef = useRef<TPageStatsConfigFuncResult>(null);
    const serverLoadChartRef = useRef<TServerStatsChartConfigFuncResult>(null);
    const gridLayoutModifierRef = useRef<GridLayoutModifier>(null);

    const [modifierGroup] = useState(new ModifierGroup());
    const [isDashboardInitialized, setIsDashboardInitialized] = useState(false);

    const configureDataBindings = (initResults: IInitResult[]) => {
        const [mainChart, pageStatisticChart, serverLoadChart, locationStatisticChart, pieChart] =
            initResults as TInitResults;
        const currentData = getData();
        const unCheckedServers = new Set<string>();
        const selectedLocations = new Set<string>();

        synchronizeXVisibleRanges(
            [mainChart.sciChartSurface, pageStatisticChart.sciChartSurface, serverLoadChart.sciChartSurface],
            () => isVisibleRangeSyncedRef.current
        );

        const mainSurface = mainChart.sciChartSurface;
        const mainXAxis = mainSurface.xAxes.get(0);

        // initial animation of visible range
        const visibleRangeDiff = mainXAxis.visibleRange.diff;
        const newInitialVisibleRange = new NumberRange(
            mainXAxis.visibleRange.min + visibleRangeDiff * 0.2,
            mainXAxis.visibleRange.max - visibleRangeDiff * 0.2
        );

        const locationFilter = (entry: TDataEntry) =>
            selectedLocations.size ? selectedLocations.has(entry.location) : true;
        const serverFilter = (entry: TDataEntry) => !unCheckedServers.has(entry.server);

        const updateLocationStats = () => {
            const currentRange = mainXAxis.visibleRange;

            const dataFilteredByTime = currentData.filter(
                (entry) => entry.timestamp >= currentRange.min && entry.timestamp <= currentRange.max
            );
            const dataFilteredForLocationStats = dataFilteredByTime.filter(serverFilter);
            locationStatisticChart.updateData(dataFilteredForLocationStats);
            pieChart.updateData(dataFilteredForLocationStats);
        };

        const updateChartData = () => {
            const commonData = currentData.filter(serverFilter).filter(locationFilter);

            const dataFilteredForServerStats = currentData.filter(locationFilter);

            mainChart.updateData(commonData);
            pageStatisticChart.updateData(
                currentData.map((entry: TDataEntry) =>
                    serverFilter(entry) && locationFilter(entry) ? entry : { ...entry, page: null }
                )
            );
            // server series should be just hidden
            serverLoadChart.updateData(dataFilteredForServerStats);
            updateLocationStats();
        };

        // filter location stats by visible range
        mainXAxis.visibleRangeChanged.subscribe(updateLocationStats);

        mainXAxis.animateVisibleRange(newInitialVisibleRange, 2000, easing.inOutQuint, () => {
            // filter data by server accordingly to visible series
            serverLoadChart.subscribeToServerSelection((server: string, isChecked: boolean) => {
                if (isChecked) {
                    unCheckedServers.delete(server);
                } else {
                    unCheckedServers.add(server);
                }

                updateChartData();
            });

            // filter data  by location
            locationStatisticChart.subscribeToLocationSelection((location) => {
                selectedLocations.clear();
                if (location) {
                    selectedLocations.add(location);
                }
                updateChartData();
            });
        });
    };

    useEffect(() => {
        return () => {
            pageStatisticChartRef.current = undefined;
            serverLoadChartRef.current = undefined;
            gridLayoutModifierRef.current = undefined;
        };
    }, []);

    const onMainChartInit = (initResult: TChartConfigResult<SciChartSurface>) => {
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
        isVisibleRangeSyncedRef.current = !isVisibleRangeSynced;
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
            subCharts.forEach((subChart: SciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.add(modifier as ChartModifierBase2D);
            });

            synchronizeXVisibleRanges(
                [serverLoadChartRef.current.sciChartSurface, ...serverLoadChartRef.current.sciChartSurface.subCharts],
                () => isVisibleRangeSyncedRef.current
            );
        } else {
            subCharts.forEach((subChart: SciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById("ServerLoadCursorModifier");
                modifierGroup.remove(modifier as ChartModifierBase2D);
            });
        }

        setIsGridLayout(!isGridLayout);
    };

    return (
        <div className={commonClasses.ChartWrapper} style={{ backgroundColor: "#242529" }}>
            {isDashboardInitialized ? null : <DashboardOverlay />}
            <div style={gridStyle}>
                <SciChartGroup
                    onInit={(initResults: IInitResult[]) => {
                        configureDataBindings(initResults);
                        setIsDashboardInitialized(true);
                    }}
                    onDelete={() => {
                        // TODO cleanup data bindings if needed
                    }}
                >
                    <div style={visibleRangeSyncCheckboxStyle}>
                        <input
                            type="checkbox"
                            checked={isVisibleRangeSynced}
                            onChange={handleSyncVisibleRangeChange}
                            value="Sync X Axis visible range"
                            style={{ color: "#17243d", accentColor: "#0bdef4", marginRight: 4 }}
                        ></input>
                        Sync X Axis visible range
                    </div>
                    <div style={hundredPercentCheckboxStyle}>
                        <input
                            type="checkbox"
                            checked={isHundredPercentCollection}
                            onChange={handleUsePercentage}
                            value="is 100% collection"
                            style={{ color: "#17243d", accentColor: "#0bdef4", marginRight: 4 }}
                        ></input>
                        is 100% collection
                    </div>

                    <div style={toggleGridLayoutCheckboxStyle}>
                        <input
                            type="checkbox"
                            checked={isGridLayout}
                            onChange={handleUseGridLayout}
                            value="is Grid Layout"
                            style={{ color: "#17243d", accentColor: "#0bdef4", marginRight: 4 }}
                        ></input>
                        is Grid Layout
                    </div>

                    <SciChart
                        initChart={createMainChart}
                        onInit={onMainChartInit}
                        style={mainChartStyle}
                        innerContainerProps={innerContainerProps}
                    >
                        <ThresholdSlider />
                        <SciChartNestedOverview style={overviewStyle} options={overviewOptions} />
                    </SciChart>

                    <SciChart
                        initChart={createPageStatisticsChart}
                        onInit={onPageStatisticsChartInit}
                        style={pageChartStyle}
                    />

                    <SciChart
                        initChart={createServerLoadChart}
                        onInit={onServerLoadChartInit}
                        style={serverChartStyle}
                    />

                    <SciChart initChart={createRegionStatisticsColumnChart} style={columnChartStyle} />

                    <SciChart initChart={createRegionStatisticsPieChart} style={pieChartStyle} />
                </SciChartGroup>
            </div>
        </div>
    );
}

type TInitResults = [
    TChartConfigResult<SciChartSurface>,
    TPageStatsConfigFuncResult,
    TServerStatsChartConfigFuncResult,
    TLocationStatsChartConfigFuncResult,
    TChartConfigResult<SciChartPieSurface>
];

const gridStyle: React.CSSProperties = {
    boxSizing: "border-box",
    padding: "0.5em",
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

const hundredPercentCheckboxStyle: CSSProperties = {
    gridArea: "4 / 1 / 5 / 3",
    color: appTheme.ForegroundColor,
    zIndex: 2,
    justifySelf: "start",
    alignSelf: "start",
    marginTop: 10,
    marginLeft: 10,
};

const toggleGridLayoutCheckboxStyle: CSSProperties = {
    gridArea: "4 / 3 / 5 / 3",
    justifySelf: "start",
    alignSelf: "start",
    marginTop: 10,
    marginLeft: 10,
    color: appTheme.ForegroundColor,
    zIndex: 2,
};

const visibleRangeSyncCheckboxStyle = {
    gridArea: "1 / 1 / 2 / 2",
    color: appTheme.ForegroundColor,
    zIndex: 2,
    justifySelf: "start",
    alignSelf: "start",
    marginTop: 10,
    marginLeft: 10,
};

export default ServerTrafficDashboard;
