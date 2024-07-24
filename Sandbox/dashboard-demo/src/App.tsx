import { CSSProperties, ChangeEventHandler, FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { appTheme } from 'scichart-example-dependencies/lib/theme';
import { TChartConfigResult, synchronizeXVisibleRanges } from './chart-configurations';
import {
    ChartModifierBase2D,
    NumberRange,
    SciChartPieSurface,
    SciChartSubSurface,
    SciChartSurface,
    easing,
} from 'scichart';
import { GridLayoutModifier } from './GridLayoutModifier';
import { ModifierGroup } from './ModifierGroup';
import {
    createRegionStatisticsColumnChart,
    createRegionStatisticsPieChart,
    TLocationStatsChartConfigFuncResult,
} from './region-statistic-charts';
import { createMainChart } from './main-chart-config';
import { TPageStatsConfigFuncResult, createPageStatisticsChart } from './page-statistics-chart-config';
import { TServerStatsChartConfigFuncResult, createServerLoadChart } from './server-load-chart-config';
import { TDataEntry, availableLocations, getData } from './data-generation';
import { overviewOptions } from './Overview';
import DashboardOverlay from './DashboardOverlay';
import ThresholdSlider from './ThresholdSlider';
import { IInitResult, SciChartReact as SciChart, SciChartGroup, SciChartNestedOverview } from 'scichart-react';
import { Responsive, ResponsiveProps, WidthProvider } from 'react-grid-layout';
import { SizeMe, SizeMeProps, withSize } from 'react-sizeme';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import '../node_modules/react-resizable/css/styles.css';
import '../node_modules/react-grid-layout/css/styles.css';
import './custom-styles.css';

const ResponsiveGridLayout: FunctionComponent<ResponsiveProps> = (props: any) => {
    const factor = 5;

    const layout = [
        { i: 'main', x: 0 * factor, y: 0 * factor, w: 4 * factor, h: 2 * factor, static: false, isBounded: true },
        { i: 'page', x: 0 * factor, y: 2 * factor, w: 2 * factor, h: 2 * factor },
        { i: 'server', x: 2 * factor, y: 2 * factor, w: 2 * factor, h: 2 * factor },
        { i: 'column', x: 0 * factor, y: 4 * factor, w: 3 * factor, h: 2 * factor },
        { i: 'pie', x: 4 * factor, y: 4 * factor, w: 1 * factor, h: 2 * factor },
    ];

    const mobileLayout = [
        { i: 'main', x: 0 * factor, y: 0 * factor, w: 4 * factor, h: 2 * factor, static: false, isBounded: true },
        { i: 'page', x: 0 * factor, y: 2 * factor, w: 4 * factor, h: 2 * factor },
        { i: 'server', x: 0 * factor, y: 4 * factor, w: 4 * factor, h: 2 * factor },
        { i: 'column', x: 0 * factor, y: 6 * factor, w: 4 * factor, h: 2 * factor },
        { i: 'pie', x: 0 * factor, y: 8 * factor, w: 4 * factor, h: 2 * factor },
    ];
    const renderFunc = ({ size }: SizeMeProps) => {
        const rowHeight = size.height / (6 * factor) - 10;
        return (
            <Responsive
                style={{ height: '100%', overflow: 'auto' }}
                {...props}
                width={size.width}
                autoSize
                useCSSTransforms
                className='layout'
                margin={[10, 10]}
                layouts={{ lg: layout, md: mobileLayout, sm: mobileLayout, xs: mobileLayout }}
                rowHeight={rowHeight}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4 * factor, md: 4 * factor, sm: 4 * factor, xs: 4 * factor, xxs: 4 * factor }}
                draggableHandle='.react-grid-dragHandleExample'
            />
        );
    };
    return (
        <SizeMe monitorHeight refreshRate={16}>
            {renderFunc}
        </SizeMe>
    );
};
// const ResponsiveGridLayout = withSize({})(Responsive);
// const ResponsiveGridLayout = WidthProvider(Responsive);

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
        const modifier = sciChartSurface.chartModifiers.getById('TotalRequestsCursorModifier');
        const rollover = sciChartSurface.chartModifiers.getById('TotalRequestsRolloverModifier');
        modifierGroup.add(modifier as ChartModifierBase2D, rollover as ChartModifierBase2D);
    };

    const onPageStatisticsChartInit = (initResult: TPageStatsConfigFuncResult) => {
        pageStatisticChartRef.current = initResult;
        const sciChartSurface = initResult.sciChartSurface;
        const modifier = sciChartSurface.chartModifiers.getById('PageStatisticsRolloverModifier');
        modifierGroup.add(modifier as ChartModifierBase2D);
    };

    const onServerLoadChartInit = (initResult: TServerStatsChartConfigFuncResult) => {
        serverLoadChartRef.current = initResult;
        const sciChartSurface = initResult.sciChartSurface;

        gridLayoutModifierRef.current = sciChartSurface.chartModifiers.getById(
            'GridLayoutModifier'
        ) as GridLayoutModifier;

        const modifier = sciChartSurface.chartModifiers.getById('ServerLoadCursorModifier');
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
                const modifier = subChart.chartModifiers.getById('ServerLoadCursorModifier');
                modifierGroup.add(modifier as ChartModifierBase2D);
            });

            synchronizeXVisibleRanges(
                [serverLoadChartRef.current.sciChartSurface, ...serverLoadChartRef.current.sciChartSurface.subCharts],
                () => isVisibleRangeSyncedRef.current
            );
        } else {
            subCharts.forEach((subChart: SciChartSubSurface) => {
                const modifier = subChart.chartModifiers.getById('ServerLoadCursorModifier');
                modifierGroup.remove(modifier as ChartModifierBase2D);
            });
        }

        setIsGridLayout(!isGridLayout);
    };

    const dragHandle = (
        <DragIndicatorIcon
            style={{
                width: 20,
                height: 20,
                top: 10,
                left: 10,
                position: 'absolute',
                color: 'white',
                cursor: 'grab',
            }}
            className='react-grid-dragHandleExample'
        ></DragIndicatorIcon>
    );

    const charts = useMemo(() => {
        return [
            <div key='main' className='grid-layout-chart-wrapper'>
                <div style={visibleRangeSyncCheckboxStyle}>
                    <input
                        type='checkbox'
                        checked={isVisibleRangeSynced}
                        onChange={handleSyncVisibleRangeChange}
                        value='Sync X Axis visible range'
                        style={{ color: '#17243d', accentColor: '#0bdef4', marginRight: 4 }}
                    ></input>
                    Sync X Axis visible range
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
                {dragHandle}
            </div>,
            <div key='page'>
                <div style={hundredPercentCheckboxStyle}>
                    <input
                        type='checkbox'
                        checked={isHundredPercentCollection}
                        onChange={handleUsePercentage}
                        value='is 100% collection'
                        style={{ color: '#17243d', accentColor: '#0bdef4', marginRight: 4 }}
                    ></input>
                    is 100% collection
                </div>
                <SciChart
                    initChart={createPageStatisticsChart}
                    onInit={onPageStatisticsChartInit}
                    style={pageChartStyle}
                />
                {dragHandle}
            </div>,
            <div key='server'>
                <div style={toggleGridLayoutCheckboxStyle}>
                    <input
                        type='checkbox'
                        checked={isGridLayout}
                        onChange={handleUseGridLayout}
                        value='is Grid Layout'
                        style={{ color: '#17243d', accentColor: '#0bdef4', marginRight: 4 }}
                    ></input>
                    is Grid Layout
                </div>
                <SciChart initChart={createServerLoadChart} onInit={onServerLoadChartInit} style={serverChartStyle} />
                {dragHandle}
            </div>,
            <div key='column'>
                <SciChart initChart={createRegionStatisticsColumnChart} style={columnChartStyle} />
                {dragHandle}
            </div>,
            <div key='pie'>
                <SciChart initChart={createRegionStatisticsPieChart} style={pieChartStyle} />
                {dragHandle}
            </div>,
        ];
    }, []);

    return (
        <div className='App' style={{ height: '100vh', backgroundColor: '#242529' }}>
            {isDashboardInitialized ? null : <DashboardOverlay />}
            {/* <div style={gridStyle}> */}
            <SciChartGroup
                onInit={(initResults: IInitResult[]) => {
                    // configureDataBindings(initResults);
                    setIsDashboardInitialized(true);
                }}
                onDelete={() => {
                    // TODO cleanup data bindings if needed
                }}
            >
                <ResponsiveGridLayout>{charts}</ResponsiveGridLayout>
            </SciChartGroup>
            {/* </div> */}
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

const overviewStyle: CSSProperties = {
    height: '20%',
};

const pageChartStyle: CSSProperties = {
    gridRow: '4 / 7',
    gridColumn: '1 / 3',
};

const serverChartStyle: CSSProperties = {
    gridRow: '4 / 7',
    gridColumn: '3 / -1',
};

const columnChartStyle: CSSProperties = {
    gridRow: '7 / -1',
    gridColumn: 'span 3',
};
const pieChartStyle: CSSProperties = {
    gridRow: '7 / -1',
    gridColumn: 'span 1',
};

const hundredPercentCheckboxStyle: CSSProperties = {
    position: 'absolute',
    gridArea: '4 / 1 / 5 / 3',
    color: appTheme.ForegroundColor,
    zIndex: 2,
    justifySelf: 'start',
    alignSelf: 'start',
    marginTop: 10,
    marginLeft: 30,
};

const toggleGridLayoutCheckboxStyle: CSSProperties = {
    position: 'absolute',
    gridArea: '4 / 3 / 5 / 3',
    justifySelf: 'start',
    alignSelf: 'start',
    marginTop: 10,
    marginLeft: 30,
    color: appTheme.ForegroundColor,
    zIndex: 2,
};

const visibleRangeSyncCheckboxStyle: CSSProperties = {
    position: 'absolute',
    color: appTheme.ForegroundColor,
    zIndex: 2,
    justifySelf: 'start',
    alignSelf: 'start',
    marginTop: 10,
    marginLeft: 30,
};

export default ServerTrafficDashboard;
