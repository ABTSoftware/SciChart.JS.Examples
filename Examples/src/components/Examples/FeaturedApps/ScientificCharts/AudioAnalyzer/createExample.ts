import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationApi } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");
        const api = getChartsInitializationApi();

        const fill = { height: "100%", width: "100%" };
        const audioHost = h("div", { style: fill });
        const fftHost = h("div", { style: fill });
        const spectrogramHost = h("div", { style: fill });
        root.append(
            h("div", { style: { position: "relative", flexBasis: "50%" } }, audioHost),
            h(
                "div",
                { class: "flex flex-1" },
                h("div", { class: "flex-1", style: { position: "relative" } }, fftHost),
                h("div", { class: "flex-1", style: { position: "relative" } }, spectrogramHost)
            )
        );
        await Promise.all([
            demo.mount(api.initAudioChart, audioHost),
            demo.mount(api.initFftChart, fftHost),
            demo.mount(api.initSpectogramChart, spectrogramHost),
        ]);
        const controls = api.onAllChartsInit();
        demo.cleanup(() => {
            controls.stopUpdate();
            controls.cleanup();
        });
        controls.startUpdate();
    });
