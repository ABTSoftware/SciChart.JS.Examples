import { Demo, element } from "../../../demoHelpers";
import { getChartsInitializationApi } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");
        const api = getChartsInitializationApi();
        const main = element("div", root, "min-h-0");
        main.style.flexBasis = "15%";
        const sections = element("div", root, "flex flex-1 min-h-0");
        await Promise.all([
            demo.chart(api.initAudioChart, main),
            demo.chart(api.initFftChart, sections, "flex-1 min-w-0 h-full"),
        ]);
        const controls = api.onAllChartsInit();
        demo.cleanup(() => {
            controls.stopUpdate();
            controls.cleanup();
        });
        controls.startUpdate();
    });
