import { divCrossSection1, divCrossSection2, divMainChart3DId, getChartsInitializationAPI } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const chartsInitializationAPI = getChartsInitializationAPI();
    const charts = await Promise.all([
        chartsInitializationAPI.initMainChart3D(divMainChart3DId),
        chartsInitializationAPI.initCrossSectionLeft(divCrossSection1),
        chartsInitializationAPI.initCrossSectionRight(divCrossSection2),
    ]);

    chartsInitializationAPI.configureAfterInit();

    return () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };
};

create();

// call the `cleanup` returned by the `create` promise to dispose the chart when necessary
