import { Demo, h } from "../../../demoHelpers";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        // The root is a positioning container here; the chart itself is the chart wrapper
        root.classList.remove("sc-chart-wrapper");
        root.classList.add("relative", "w-full", "h-full");
        const chartHost = h("div", { class: "sc-chart-wrapper" });
        const legendHost = h("div", { class: "sc-color-legend" });
        root.append(chartHost, legendHost);
        await Promise.all([demo.mount(drawExample, chartHost), demo.mount(drawHeatmapLegend, legendHost)]);
    });
