import { InfoIcon, PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationApi } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const api = getChartsInitializationApi();
        let controls: Awaited<ReturnType<typeof api.onAllChartsInit>> | undefined;
        let running = true;

        const showRunning = (value: boolean) => {
            running = value;
            const label = running ? "Stop updates" : "Start updates";
            toggle.setAttribute("aria-label", label);
            toggle.title = label;
            toggle.replaceChildren(running ? StopIcon() : PlayArrowIcon());
        };
        const toggle = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Stop updates",
                title: "Stop updates",
                type: "button",
                onclick: () => {
                    if (!controls) return;
                    if (running) controls.stopUpdate();
                    else controls.startUpdate();
                    showRunning(!running);
                },
            },
            StopIcon()
        );

        const loadExample = (selected: HTMLButtonElement, load: () => void) => {
            if (!controls) return;
            load();
            showRunning(true);
            [basicButton, doubleSlitButton].forEach((button) =>
                button.setAttribute("aria-checked", String(button === selected))
            );
        };
        const basicButton: HTMLButtonElement = h(
            "button",
            {
                class: "sc-button",
                role: "radio",
                "aria-checked": "true",
                type: "button",
                onclick: () => loadExample(basicButton, () => controls.twoPoint()),
            },
            "Basic example"
        );
        const doubleSlitButton: HTMLButtonElement = h(
            "button",
            {
                class: "sc-button",
                role: "radio",
                "aria-checked": "false",
                type: "button",
                onclick: () => loadExample(doubleSlitButton, () => controls.interference()),
            },
            "Double slit example"
        );

        const chartHost = () => h("div", { style: { flex: "1 1 31.25rem" } });
        const mainChart = chartHost();
        const crossSectionChart = chartHost();
        const inputChart = chartHost();
        const historyChart = chartHost();
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                toggle,
                h(
                    "div",
                    { class: "sc-button-group", role: "radiogroup", "aria-label": "Load example" },
                    basicButton,
                    doubleSlitButton
                ),
                h(
                    "button",
                    {
                        class: "sc-button sc-button-icon",
                        id: "showHelp",
                        "aria-label": "Show help",
                        title: "Show help",
                        type: "button",
                        onclick: () => controls?.showHelp(),
                    },
                    InfoIcon()
                )
            ),
            h("div", { class: "flex", style: { flexBasis: "31.25rem" } }, mainChart, crossSectionChart),
            h("div", { class: "flex", style: { flexBasis: "31.25rem" } }, inputChart, historyChart)
        );

        await Promise.all([
            demo.mount(api.initMainChart, mainChart),
            demo.mount(api.initCrossSectionChart, crossSectionChart),
            demo.mount(api.inputChart, inputChart),
            demo.mount(api.initHistoryChart, historyChart),
        ]);
        controls = api.onAllChartsInit();
        demo.cleanup(() => controls.stopUpdate());
    });
