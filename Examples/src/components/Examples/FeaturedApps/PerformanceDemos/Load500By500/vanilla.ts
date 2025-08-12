import { drawExample, TTimeSpan } from "./drawExample";

const isMobileView = false;

const initChart = (rootElement: string | HTMLDivElement) =>
    drawExample(
        rootElement,
        (newTimeSpans: TTimeSpan[]) => {
            console.log(newTimeSpans);
        },
        isMobileView
    );

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface, controls } = await initChart("chart");

    controls.startUpdate();

    const destructor = () => {
        controls.stopUpdate();
        sciChartSurface.delete();
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
