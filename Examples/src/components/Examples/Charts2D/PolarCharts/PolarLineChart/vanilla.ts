import { getChartsInitializationAPI } from "./drawExample";

const chartsInitializationAPI = getChartsInitializationAPI();

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const charts = await Promise.all([
        chartsInitializationAPI.line1("chart1"),
        chartsInitializationAPI.line2("chart2"),
        chartsInitializationAPI.line3("chart3"),
        chartsInitializationAPI.line4("chart4"),
        chartsInitializationAPI.line5("chart5"),
        chartsInitializationAPI.line6("chart6"),
    ]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
