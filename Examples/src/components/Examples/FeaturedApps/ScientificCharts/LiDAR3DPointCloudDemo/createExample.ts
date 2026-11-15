import { Demo } from "../../../demoHelpers";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        await Promise.all([demo.chart(drawExample), demo.chart(drawHeatmapLegend, root, "sc-color-legend")]);
    });
