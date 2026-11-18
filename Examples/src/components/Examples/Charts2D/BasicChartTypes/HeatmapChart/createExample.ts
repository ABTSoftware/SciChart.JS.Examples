import { PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, drawHeatmapLegend } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isStarted = false;

        const setIsStarted = (value: boolean) => {
            isStarted = value;
            const label = isStarted ? "Pause updates" : "Start updates";
            toggleButton.setAttribute("aria-label", label);
            toggleButton.title = label;
            toggleButton.replaceChildren(isStarted ? StopIcon() : PlayArrowIcon());
        };
        const toggleButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Start updates",
                title: "Start updates",
                type: "button",
                onclick: () => {
                    if (!controls) return;
                    if (isStarted) controls.stopUpdate();
                    else controls.startUpdate();
                    setIsStarted(!isStarted);
                },
            },
            PlayArrowIcon()
        );
        const xSize = document.createTextNode("0");
        const ySize = document.createTextNode("0");
        const fps = document.createTextNode("00");

        const chartHost = h("div", { class: "w-full h-full" });
        const legendHost = h("div", { class: "sc-color-legend" });
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row monospace" },
                toggleButton,
                h("div", {}, "# Heatmap Size: ", xSize, " x ", ySize),
                h("div", {}, "FPS: ", fps, " ")
            ),
            h("div", { class: "relative" }, chartHost, legendHost)
        );

        const [chart] = await Promise.all([
            demo.mount(drawExample, chartHost, (result) => result.controls.stopUpdate()),
            demo.mount(drawHeatmapLegend, legendHost),
        ]);
        controls = chart.controls;
        chart.subscribeToRenderStats((stats) => {
            xSize.data = String(stats.xSize);
            ySize.data = String(stats.ySize);
            fps.data = stats.fps.toFixed(0).padStart(2, "0");
        });

        // Start the demo
        controls.startUpdate();
        setIsStarted(true);
    });
