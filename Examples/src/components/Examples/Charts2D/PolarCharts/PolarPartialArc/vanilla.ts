import { drawExample } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const totalAngle = 0.004;
    const innerRadius = 0.9977;
    const callback = () => {};

    const initChart = (rootElementId: string | HTMLDivElement) =>
        drawExample(rootElementId, innerRadius, totalAngle, callback);

    const { sciChartSurface, controls } = await initChart("chart");

    controls.startAnimation();

    const destructor = () => {
        controls.endAnimation();
        sciChartSurface.delete();
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
