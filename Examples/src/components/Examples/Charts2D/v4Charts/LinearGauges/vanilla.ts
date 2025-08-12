import { getChartsInitializationAPI } from "./drawExample";

const chartsInitializationAPI = getChartsInitializationAPI();

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const charts = await Promise.all([
        chartsInitializationAPI.gauge1("chart1"),
        chartsInitializationAPI.gauge2("chart2"),
        chartsInitializationAPI.gauge3("chart3"),
        chartsInitializationAPI.gauge4("chart4"),
        chartsInitializationAPI.gauge5("chart5"),
        chartsInitializationAPI.gauge6("chart6"),
    ]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
