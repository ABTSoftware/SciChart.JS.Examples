import { CSSProperties, ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import SciChart, { IInitResult } from './SciChart';
import { TChartConfigResult, TPageStatsConfigFuncResult, synchronizeXVisibleRanges } from './chart-configurations';
import {
    ChartModifierBase2D,
    DataPointSelectionChangedArgs,
    DataPointSelectionModifier,
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    IOverviewOptions,
    IRenderableSeries,
    LegendModifier,
    MemoryUsageHelper,
    NumberRange,
    Point,
    RolloverModifier,
    SciChartPieSurface,
    SciChartSubSurface,
    SciChartSurface,
    TCheckedChangedArgs,
    Thickness,
    easing,
} from 'scichart';
import { GridLayoutModifier } from './GridLayoutModifier';
import { ModifierGroup } from './ModifierGroup';
import { createChart5, createChart3 } from './region-statistic-charts';
import { createChart1 } from './main-chart-config';
import { createChart2 } from './page-statistics-chart-config';
import { createChart4 } from './server-load-chart-config';
import { TDataEntry, availableLocations, getData } from './data-generation';
import { appTheme } from 'scichart-example-dependencies/lib/theme';
import Overview from './Overview';
import DashboardOverlay from './DashboardOverlay';
import ThresholdSlider from './ThresholdSlider';

// SciChartSurface.autoDisposeWasmContext = true;
// MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [drawChart, setDrawChart] = useState(true);
    const [isVisibleRangeSynced, setIsVisibleRangeSynced] = useState(false);
    const isVisibleRangeSyncedRef = useRef(false);
    const [isHundredPercentCollection, setIsHundredPercentCollection] = useState(false);
    const [isGridLayout, setIsGridLayout] = useState(false);
    const [isChartInitialized1, setIsChartInitialized1] = useState(false);
    const [isChartInitialized2, setIsChartInitialized2] = useState(false);
    const [isChartInitialized3, setIsChartInitialized3] = useState(false);
    const [isChartInitialized4, setIsChartInitialized4] = useState(false);
    const [isChartInitialized5, setIsChartInitialized5] = useState(false);

    const mainChartRef = useRef<TChartConfigResult<SciChartSurface>>(null);
    const pageStatisticChartRef = useRef<TPageStatsConfigFuncResult>(null);
    const serverLoadChartRef = useRef<TChartConfigResult<SciChartSurface>>(null);
    const locationStatisticChartRef = useRef<TChartConfigResult<SciChartSurface>>(null);
    const pieChartRef = useRef<TChartConfigResult<SciChartPieSurface>>(null);
    const gridLayoutModifierRef = useRef<GridLayoutModifier>(null);

    const [modifierGroup] = useState(new ModifierGroup());

    useEffect(() => {
        if (
            isChartInitialized1 &&
            isChartInitialized2 &&
            isChartInitialized3 &&
            isChartInitialized4 &&
            isChartInitialized5
        ) {
            let currentData = getData();
            const unCheckedServers = new Set<string>();
            const selectedLocations = new Set<string>();

            synchronizeXVisibleRanges(
                [
                    mainChartRef.current.sciChartSurface as SciChartSurface,
                    pageStatisticChartRef.current.sciChartSurface as SciChartSurface,
                    serverLoadChartRef.current.sciChartSurface as SciChartSurface,
                ],
                () => isVisibleRangeSyncedRef.current
            );

            const mainSurface = mainChartRef.current.sciChartSurface as SciChartSurface;
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
                locationStatisticChartRef.current.updateData(dataFilteredForLocationStats);
                pieChartRef.current.updateData(dataFilteredForLocationStats);
            };

            const updateChartData = () => {
                const commonData = currentData.filter(serverFilter).filter(locationFilter);

                const dataFilteredForServerStats = currentData.filter(locationFilter);

                mainChartRef.current.updateData(commonData);
                pageStatisticChartRef.current.updateData(commonData);
                // server series should be just hidden
                serverLoadChartRef.current.updateData(dataFilteredForServerStats);
                updateLocationStats();
            };

            mainXAxis.animateVisibleRange(newInitialVisibleRange, 2000, easing.inCirc, () => {
                // filter location stats by visible range
                mainXAxis.visibleRangeChanged.subscribe((args) => {
                    updateLocationStats();
                });

                // filter data by server accordingly to visible series
                const serverLoadLegendModifier = serverLoadChartRef.current.sciChartSurface.chartModifiers.getById(
                    'LegendModifier'
                ) as LegendModifier;

                serverLoadLegendModifier.isCheckedChanged.subscribe((args: TCheckedChangedArgs) => {
                    const server = args.series.getDataSeriesName();
                    if (args.isChecked) {
                        unCheckedServers.delete(server);
                    } else {
                        unCheckedServers.add(server);
                    }

                    updateChartData();
                });

                // filter data  by location
                const dataPointSelectionModifier =
                    locationStatisticChartRef.current.sciChartSurface.chartModifiers.getById(
                        'DataPointSelectionModifier'
                    ) as DataPointSelectionModifier;

                dataPointSelectionModifier.selectionChanged.subscribe((data: DataPointSelectionChangedArgs) => {
                    selectedLocations.clear();

                    data.selectedDataPoints.forEach((dataPoint) => {
                        const selectedLocation = availableLocations[dataPoint.xValue];
                        selectedLocations.add(selectedLocation);
                    });
                    updateChartData();
                });
            });
        }
    }, [isChartInitialized1, isChartInitialized2, isChartInitialized3]);

    useEffect(() => {
        return () => {
            mainChartRef.current = undefined;
            pageStatisticChartRef.current = undefined;
            locationStatisticChartRef.current = undefined;
        };
    }, []);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log('state', state);
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

        if (!isGridLayout) {
            serverLoadChartRef.current.sciChartSurface.subCharts.forEach((subChart: SciChartSubSurface) => {
                const rolloverModifier = subChart.chartModifiers.getById(
                    'ServerLoadCursorModifier'
                ) as RolloverModifier;
                modifierGroup.add(rolloverModifier);
            });
            synchronizeXVisibleRanges(
                [serverLoadChartRef.current.sciChartSurface, ...serverLoadChartRef.current.sciChartSurface.subCharts],
                () => isVisibleRangeSyncedRef.current
            );
        } else {
            serverLoadChartRef.current.sciChartSurface.subCharts.forEach((subChart: SciChartSubSurface) => {
                const rolloverModifier = subChart.chartModifiers.getById(
                    'ServerLoadCursorModifier'
                ) as RolloverModifier;
                modifierGroup.remove(rolloverModifier);
            });
        }

        setIsGridLayout(!isGridLayout);
    };

    return (
        <div className='App' style={{ height: '100vh', backgroundColor: '#242529' }}>
            {!(
                isChartInitialized1 &&
                isChartInitialized2 &&
                isChartInitialized3 &&
                isChartInitialized4 &&
                isChartInitialized5
            ) && <DashboardOverlay />}
            {/* <header className='App-header'> */}
            {/* <h1>SciChart.js Dashboard</h1> */}
            {/* </header> */}
            {/* <input type='checkbox' checked={drawChart} onChange={handleCheckbox} /> Show Chart */}
            {/* <br /> */}
            {/* <input type='button' onClick={handleClick} value='Log Object Registry State'></input> */}

            <div style={gridStyle}>
                <div
                    style={{
                        gridArea: '1 / 1 / 2 / 2',
                        color: appTheme.ForegroundColor,
                        zIndex: 2,
                        justifySelf: 'start',
                        alignSelf: 'start',
                        marginTop: 10,
                        marginLeft: 10,
                    }}
                >
                    <input
                        type='checkbox'
                        checked={isVisibleRangeSynced}
                        onChange={handleSyncVisibleRangeChange}
                        value='Sync X Axis visible range'
                    ></input>
                    Sync X Axis visible range
                </div>
                <div
                    style={{
                        gridArea: '4 / 1 / 5 / 3',
                        color: appTheme.ForegroundColor,
                        zIndex: 2,
                        justifySelf: 'start',
                        alignSelf: 'start',
                        marginTop: 10,
                        marginLeft: 10,
                    }}
                >
                    <input
                        type='checkbox'
                        checked={isHundredPercentCollection}
                        onChange={handleUsePercentage}
                        value='is 100% collection'
                    ></input>
                    is 100% collection
                </div>

                <div
                    style={{
                        gridArea: '4 / 3 / 5 / 3',
                        justifySelf: 'start',
                        alignSelf: 'start',
                        marginTop: 10,
                        marginLeft: 10,
                        color: appTheme.ForegroundColor,
                        zIndex: 2,
                    }}
                >
                    <input
                        type='checkbox'
                        checked={isGridLayout}
                        onChange={handleUseGridLayout}
                        value='is Grid Layout'
                    ></input>
                    is Grid Layout
                </div>

                {drawChart ? (
                    <>
                        <SciChart
                            initChart={createChart1}
                            onInit={(initResult: TChartConfigResult<SciChartSurface>) => {
                                mainChartRef.current = initResult;
                                // setIsChartInitialized1(true);

                                const sciChartSurface = initResult.sciChartSurface;
                                const modifier = sciChartSurface.chartModifiers.getById('TotalRequestsCursorModifier');
                                const rollover = sciChartSurface.chartModifiers.getById(
                                    'TotalRequestsRolloverModifier'
                                );
                                modifierGroup.add(modifier as ChartModifierBase2D, rollover as ChartModifierBase2D);
                            }}
                            style={mainChartStyle}
                            innerContainerProps={innerContainerProps}
                            fallback={<div style={mainChartStyle} />}
                        >
                            <ThresholdSlider></ThresholdSlider>
                            <Overview
                                style={overviewStyle}
                                options={overviewOptions}
                                onInit={() => setIsChartInitialized1(true)}
                            ></Overview>
                        </SciChart>

                        <SciChart<SciChartSurface, TPageStatsConfigFuncResult>
                            initChart={createChart2}
                            onInit={(initResult: TPageStatsConfigFuncResult) => {
                                pageStatisticChartRef.current = initResult;
                                const sciChartSurface = initResult.sciChartSurface;

                                setIsChartInitialized2(true);

                                const modifier = (sciChartSurface as SciChartSurface).chartModifiers.getById(
                                    'PageStatisticsRolloverModifier'
                                );
                                modifierGroup.add(modifier as ChartModifierBase2D);
                            }}
                            style={pageChartStyle}
                            fallback={<div style={pageChartStyle} />}
                        />
                        <SciChart
                            initChart={createChart4}
                            onInit={(initResult: TChartConfigResult<SciChartSurface>) => {
                                serverLoadChartRef.current = initResult;
                                setIsChartInitialized4(true);
                                const sciChartSurface = initResult.sciChartSurface;

                                // type TW<T extends (...args: any) => any> =  Awaited<ReturnType<T>>
                                // type TY = Awaited<ReturnType<typeof createChart4>>
                                gridLayoutModifierRef.current = (
                                    sciChartSurface as SciChartSurface
                                ).chartModifiers.getById('GridLayoutModifier') as GridLayoutModifier;

                                const modifier = (sciChartSurface as SciChartSurface).chartModifiers.getById(
                                    'ServerLoadCursorModifier'
                                ) as ChartModifierBase2D;
                                modifierGroup.add(modifier);
                            }}
                            style={serverChartStyle}
                            fallback={<div style={serverChartStyle} />}
                        />
                        <SciChart
                            initChart={createChart5}
                            onInit={(initResult: TChartConfigResult<SciChartSurface>) => {
                                locationStatisticChartRef.current = initResult;
                                setIsChartInitialized5(true);
                            }}
                            style={columnChartStyle}
                            fallback={<div style={columnChartStyle} />}
                        />

                        <SciChart<SciChartPieSurface, TChartConfigResult<SciChartPieSurface>>
                            initChart={createChart3}
                            onInit={(initResult: TChartConfigResult<SciChartPieSurface>) => {
                                pieChartRef.current = initResult;
                                setIsChartInitialized3(true);
                            }}
                            style={pieChartStyle}
                            fallback={<div style={pieChartStyle} />}
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    padding: '0.5em',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.2em',
    gridTemplateRows: 'repeat(8, 1fr)',
};

const mainChartStyle: CSSProperties = {
    gridRow: '1 / 4',
    gridColumn: '1/-1',
    position: 'relative',
};

const innerContainerProps = {
    style: {
        height: '80%',
    },
};

const overviewStyle = {
    height: '20%',
};

const pageChartStyle = {
    gridRow: '4 / 8',
    gridColumn: '1 / 3',
};

const serverChartStyle = {
    gridRow: '4 / 8',
    gridColumn: '3 / -1',
};

const columnChartStyle = {
    gridRow: '8 / -1',
    gridColumn: 'span 3',
};
const pieChartStyle = {
    gridRow: '8 / -1',
    gridColumn: 'span 1',
};

const overviewOptions: IOverviewOptions = {
    theme: appTheme.SciChartJsTheme,
    padding: Thickness.fromString('0 10 10 10'),
    viewportBorder: {
        color: appTheme.DarkIndigo,
        border: 2,
    },
    transformRenderableSeries: (renderableSeries: IRenderableSeries) => {
        if (renderableSeries.type !== ESeriesType.MountainSeries) {
            return undefined;
        }

        const copiedSeries = new FastMountainRenderableSeries(renderableSeries.parentSurface.webAssemblyContext2D, {
            dataSeries: renderableSeries.dataSeries,
            stroke: appTheme.MutedPink,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 1), [
                { color: appTheme.MutedPurple, offset: 0 },
                { color: appTheme.MutedBlue, offset: 0.5 },
                { color: appTheme.MutedOrange, offset: 1 },
            ]),
        });

        return copiedSeries;
    },
};

export default App;
