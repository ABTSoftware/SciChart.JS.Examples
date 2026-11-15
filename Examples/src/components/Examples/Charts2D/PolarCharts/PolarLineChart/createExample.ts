import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-chart-grid");
        const api = getChartsInitializationAPI();
        await Promise.all(
            [api.line1, api.line2, api.line3, api.line4, api.line5, api.line6].map((init) => {
                const chartHost = h("div");
                root.append(chartHost);
                return demo.mount(init, chartHost);
            })
        );
    });
