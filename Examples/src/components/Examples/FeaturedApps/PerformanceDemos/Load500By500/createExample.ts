import { PlayArrowIcon, RefreshIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, TTimeSpan } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isStarted = false;

        const showStarted = (started: boolean) => {
            isStarted = started;
            toggleButton.setAttribute("aria-label", isStarted ? "Pause updates" : "Start updates");
            toggleButton.replaceChildren(isStarted ? StopIcon() : PlayArrowIcon());
            reloadButton.disabled = isStarted;
        };
        const toggleButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Start updates",
                title: "Toggle reload every 200 milliseconds",
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

        const results = h("div", { class: "flex-1" });
        const showTimeSpans = (timeSpans: TTimeSpan[]) =>
            results.replaceChildren(
                h("h4", {}, "Performance Results"),
                ...timeSpans.map((ts) => h("div", {}, ts.title, ": ", ts.durationMs.toFixed(0), " ms"))
            );
        showTimeSpans([
            { title: "Generate Data Points", durationMs: 0 },
            { title: "Append Data Points", durationMs: 0 },
            { title: "Render the frame", durationMs: 0 },
        ]);

        const chartHost = h("div", { class: "flex-1" });
        root.append(
            chartHost,
            h(
                "header",
                { class: "sc-toolbar-row", style: { order: "1" } },
                h("div", { class: "flex flex-col gap-2" }, toggleButton, reloadButton),
                results
            )
        );

        const isMobileView = root.getBoundingClientRect().width < 600;
        const chart = await demo.mount(
            (host) => drawExample(host, showTimeSpans, isMobileView),
            chartHost,
            (result) => result.controls.stopUpdate()
        );
        controls = chart.controls;
        controls.startUpdate();
        showStarted(true);
    });
