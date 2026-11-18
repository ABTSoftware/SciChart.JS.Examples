import { PlayArrowIcon, RefreshIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, TTimeSpan } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isStarted = false;

        const results = h("div", { class: "flex-1" });
        const updateResults = (timeSpans: TTimeSpan[]) => {
            results.replaceChildren(
                h("h4", {}, "Performance Results"),
                ...timeSpans.map((ts) => h("div", {}, ts.title, ": ", ts.durationMs.toFixed(0), " ms"))
            );
        };
        updateResults([
            { title: "Generate 1M Data Points", durationMs: 0 },
            { title: "Append 1M Data Points", durationMs: 0 },
            { title: "Render the frame", durationMs: 0 },
        ]);

        const toggleButton = h("button", {
            class: "sc-button sc-button-icon",
            title: "Toggle reload every 200 milliseconds",
            type: "button",
            onclick: () => {
                if (isStarted) controls?.stopUpdate();
                else controls?.startUpdate();
                isStarted = !isStarted;
                updateControls();
            },
        });
        const reloadButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Reload once",
                title: "Reload Test",
                type: "button",
                onclick: () => controls?.reloadOnce(),
            },
            RefreshIcon()
        );
        const updateControls = () => {
            toggleButton.setAttribute("aria-label", isStarted ? "Pause updates" : "Start updates");
            toggleButton.replaceChildren(isStarted ? StopIcon() : PlayArrowIcon());
            reloadButton.disabled = isStarted;
        };
        updateControls();

        const host = h("div");
        root.append(
            host,
            h(
                "header",
                { class: "sc-toolbar-row", style: { order: "1" } },
                h(
                    "div",
                    { class: "flex flex-col gap-2", role: "group", "aria-label": "Data reload controls" },
                    toggleButton,
                    reloadButton
                ),
                results
            )
        );
        const chart = await demo.mount(drawExample, host, (result) => result.controls.stopUpdate());
        controls = chart.controls;
        controls.subscribeToInfo(updateResults);
        controls.startUpdate();
        isStarted = true;
        updateControls();
    });
