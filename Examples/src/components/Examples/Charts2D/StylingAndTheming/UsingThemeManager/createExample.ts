import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-chart-grid");
        const api = getChartsInitializationAPI();
        await Promise.all(
            [
                api.createNavyThemeChart,
                api.createLightThemeChart,
                api.createDarkThemeChart,
                api.createCustomThemeChart,
            ].map((init) => {
                const chartHost = h("div");
                root.append(chartHost);
                return demo.mount(init, chartHost);
            })
        );
    });
