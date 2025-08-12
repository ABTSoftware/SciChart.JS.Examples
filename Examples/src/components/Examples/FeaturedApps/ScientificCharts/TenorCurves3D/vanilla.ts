import { draw3DChart, drawHeatmapLegend, drawLineChart1, drawLineChart2 } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const charts = await Promise.all([
        draw3DChart("chart"),
        drawHeatmapLegend("legend"),
        drawLineChart1("lineChart1"),
        drawLineChart2("lineChart2"),
    ]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
