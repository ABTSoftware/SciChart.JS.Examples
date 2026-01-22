import { drawExample, drawHeatmapLegend } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const charts = await Promise.all([drawExample("chart"), drawHeatmapLegend("legend")]);

    const destructor = () => {
        charts.forEach(({ sciChartSurface }) => sciChartSurface.delete());
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
