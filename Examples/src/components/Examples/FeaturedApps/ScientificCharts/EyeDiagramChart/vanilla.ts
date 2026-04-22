import { drawExample } from "./drawExample";

const create = async () => {
    const { controls } = await drawExample("chart");

    const destructor = () => {
        controls.cleanup();
    };

    return destructor;
};

create();
