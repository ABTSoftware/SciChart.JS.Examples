import { PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isStarted = false;

        const showStarted = (started: boolean) => {
            isStarted = started;
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
                    showStarted(!isStarted);
                },
            },
            PlayArrowIcon()
        );
        const numberPoints = document.createTextNode("0");
        const fps = document.createTextNode("00");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                toggleButton,
                h("span", { class: "monospace" }, "# DataPoints: ", numberPoints),
                h("span", { class: "monospace" }, "FPS: ", fps, " ")
            )
        );

        const result = await demo.chart(drawExample, root, "w-full h-full", (chart) => chart.controls.stopUpdate());
        controls = result.controls;
        controls.setStatsChangedCallback((stats) => {
            numberPoints.data = stats.numberPoints.toLocaleString();
            fps.data = stats.fps.toFixed(0).padStart(2, "0");
        });
        controls.startUpdate();
        showStarted(true);
    });
