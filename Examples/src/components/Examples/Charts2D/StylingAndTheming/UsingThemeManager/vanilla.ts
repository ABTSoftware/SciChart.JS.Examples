import { getChartsInitializationAPI } from "./drawExample";

const divElementId1 = "divElementId1";
const divElementId2 = "divElementId2";
const divElementId3 = "divElementId3";
const divElementId4 = "divElementId4";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const chartInitializationApi = getChartsInitializationAPI();
    const charts = await Promise.all([
        chartInitializationApi.createNavyThemeChart(divElementId1),
        chartInitializationApi.createLightThemeChart(divElementId2),
        chartInitializationApi.createDarkThemeChart(divElementId3),
        chartInitializationApi.createCustomThemeChart(divElementId4),
    ]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
