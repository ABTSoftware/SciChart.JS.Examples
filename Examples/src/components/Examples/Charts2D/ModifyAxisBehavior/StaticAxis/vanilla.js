import { drawExample } from "./drawExample";
/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface } = await drawExample("chart");
    const destructor = () => {
        sciChartSurface.delete();
    };
    return destructor;
};
create();
// call the `destructor` returned by the `create` promise to dispose the charts when necessary
