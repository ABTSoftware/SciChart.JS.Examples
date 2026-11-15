import { Demo, element } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        await demo.chart(drawExample);
        element("h2", root, "sc-chart-title", "Market share of Mobile Phone Manufacturers (2022)");
    });
