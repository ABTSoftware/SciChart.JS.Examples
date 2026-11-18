import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("w-full", "h-full", "flex", "flex-col");
        const api = getChartsInitializationAPI();

        const fill = { height: "100%", width: "100%" };
        const mainHost = h("div", { style: fill });
        const leftHost = h("div", { style: fill });
        const rightHost = h("div", { style: fill });
        root.append(
            h("div", { style: { position: "relative", flex: "1 1 60%" } }, mainHost),
            h(
                "div",
                { class: "flex", style: { flex: "1 1 40%" } },
                h("div", { class: "flex-1", style: { position: "relative" } }, leftHost),
                h("div", { class: "flex-1", style: { position: "relative" } }, rightHost)
            )
        );
        await Promise.all([
            demo.mount(api.initMainChart, mainHost),
            demo.mount(api.initCrossSectionLeft, leftHost),
            demo.mount(api.initCrossSectionRight, rightHost),
        ]);
        api.configureAfterInit();
    });
