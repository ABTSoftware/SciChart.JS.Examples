import { drawExample } from "./drawExample";

const create = async () => {
    const { sciChartSurface, controls } = await drawExample("chart");
    controls.startAnimation();

    const destructor = () => {
        controls.cleanup();
    };

    return destructor;
};

create();
