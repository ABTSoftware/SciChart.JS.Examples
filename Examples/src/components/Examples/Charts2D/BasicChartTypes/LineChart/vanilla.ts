import { getChartsInitializationAPI } from "./drawExample";

const chartsInitializationAPI = getChartsInitializationAPI();
const {
    initJustLineCharts,
    initDigitalLineCharts,
    initTooltipsOnLineCharts,
    initDashedLineCharts,
    initPalettedLineCharts,
    initHoveredLineCharts,
    initGapsInLineCharts,
    initVerticalLineCharts,
    initThresholdedLineCharts,
} = chartsInitializationAPI;

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const charts = await Promise.all([
        initJustLineCharts("lineChart8"),
        initDigitalLineCharts("lineChart7"),
        initTooltipsOnLineCharts("lineChart6"),
        initDashedLineCharts("lineChart5"),
        initPalettedLineCharts("lineChart4"),
        initHoveredLineCharts("lineChart3"),
        initGapsInLineCharts("lineChart2"),
        initVerticalLineCharts("lineChart1"),
        initThresholdedLineCharts("lineChart0"),
    ]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
