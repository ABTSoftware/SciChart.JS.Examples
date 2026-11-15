import { Demo, element } from "../../../demoHelpers";
import { getChartsInitializationApi } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");
        const api = getChartsInitializationApi();
        const main = element("div", root, "min-h-0");
        main.style.flex = "1 1 37.5rem";
        const overview = element("div", root, "min-h-0");
        overview.style.flex = "1 1 6.25rem";
        await demo.chart(api.createMainChart, main);
        const result = await demo.chart(api.createOverview, overview);
        api.afterOverviewInit();
    });
