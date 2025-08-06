import { getChartsInitializationAPI } from "./drawExample";

const chartsInitializationAPI = getChartsInitializationAPI();
/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface } = await chartsInitializationAPI.initMainChart("chart");

    await Promise.all([
        chartsInitializationAPI.initCrossSectionLeft("left-section"),
        chartsInitializationAPI.initCrossSectionRight("right-section"),
    ]);

    chartsInitializationAPI.configureAfterInit();

    const destructor = () => {
        sciChartSurface.delete();
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
