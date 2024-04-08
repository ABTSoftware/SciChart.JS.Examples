import { drawExample } from "./drawExample";
/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface, controls } = await drawExample("chart");
    controls.startDemo();
    const destructor = () => {
        controls.stopDemo();
        sciChartSurface.delete();
    };
    return destructor;
};
create();
// call the `destructor` returned by the `create` promise to dispose the charts when necessary
