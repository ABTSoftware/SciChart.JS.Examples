import { Demo } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-chart-grid");
        const api = getChartsInitializationAPI();
        await Promise.all(
            [api.gauge1, api.gauge2, api.gauge3, api.gauge4, api.gauge5, api.gauge6].map((init) =>
                demo.chart(init, root, "w-full h-full")
            )
        );
    });
