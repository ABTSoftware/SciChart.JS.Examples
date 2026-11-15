import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const chartHost = h("div", { class: "w-full h-full" });
        root.append(chartHost, h("h2", { class: "sc-chart-title" }, "Market share of Internet Browsers (2022)"));
        await demo.mount(drawExample, chartHost);
    });
