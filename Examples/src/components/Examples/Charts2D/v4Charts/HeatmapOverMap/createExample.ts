import { Demo, element } from "../../../demoHelpers";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const main = element("div", root, "h-full");
        main.style.width = "calc(100% - 3.75rem)";
        const legend = element("div", root, "absolute h-full top-0 right-0");
        Object.assign(legend.style, { width: "4.0625rem", backgroundColor: "#000000dd" });
        await Promise.all([demo.chart(drawExample, main), demo.chart(drawHeatmapLegend, legend)]);
    });
