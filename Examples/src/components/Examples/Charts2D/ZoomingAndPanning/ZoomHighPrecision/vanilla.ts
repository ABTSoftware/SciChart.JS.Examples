import { drawExample, drawOverview } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface } = await drawExample("chart");
    const { sciChartSurface: overviewSurface } = await drawOverview(sciChartSurface, "overview");

    const destructor = () => {
        overviewSurface.delete();
        sciChartSurface.delete();
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
