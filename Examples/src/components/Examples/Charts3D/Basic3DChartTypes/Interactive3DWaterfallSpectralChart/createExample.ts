import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");
        const api = getChartsInitializationAPI();

        const mainChart = h("div", { class: "min-h-0", style: { flex: "1 1 60%" } });
        const crossSectionLeft = h("div", { class: "w-full h-full" });
        const crossSectionRight = h("div", { class: "w-full h-full" });
        root.append(
            mainChart,
            h("div", { class: "flex min-h-0 w-full", style: { flex: "1 1 40%" } }, crossSectionLeft, crossSectionRight)
        );

        await Promise.all([
            demo.mount(api.initMainChart3D, mainChart),
            demo.mount(api.initCrossSectionLeft, crossSectionLeft),
            demo.mount(api.initCrossSectionRight, crossSectionRight),
        ]);
        api.configureAfterInit();
    });
