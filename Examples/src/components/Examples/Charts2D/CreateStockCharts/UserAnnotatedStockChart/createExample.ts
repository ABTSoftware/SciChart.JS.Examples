import { RefreshIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { chartReviver, localStorageApi } from "scichart";

const STORAGE_KEY = "Annotated-Charts";

type ChartMode = "pan" | "line" | "marker";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let savedCharts: Record<string, object> = {};
        if (localStorageApi.storageAvailable()) {
            savedCharts = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}", chartReviver);
        }

        // Chart mode
        const modeButton = (mode: ChartMode, label: string) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    disabled: true,
                    "aria-pressed": String(mode === "line"),
                    onclick: () => {
                        controls?.setChartMode(mode);
                        modeButtons.forEach((button, key) => button.setAttribute("aria-pressed", String(key === mode)));
                    },
                },
                label
            );
        const modeButtons = new Map<ChartMode, HTMLButtonElement>([
            ["pan", modeButton("pan", "Pan")],
            ["line", modeButton("line", "Lines")],
            ["marker", modeButton("marker", "Markers")],
        ]);

        // Save
        const saveChart = () => {
            const chartName = nameInput.value.trim();
            if (!controls || !chartName) return;
            savedCharts = { ...savedCharts, [chartName]: controls.getDefinition() };
            if (localStorageApi.storageAvailable()) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCharts));
            }
            nameInput.value = chartName;
            renderSavedCharts(chartName);
            update();
        };
        const nameInput = h("input", {
            class: "sc-input",
            id: "chartName",
            type: "text",
            "aria-label": "Chart name",
            placeholder: "Chart name",
            disabled: true,
            style: { width: "6.875rem" },
            oninput: () => update(),
            onkeydown: (event: KeyboardEvent) => {
                if (event.key === "Enter") saveChart();
            },
        });
        const saveButton = h(
            "button",
            { class: "sc-button sc-button-outline", type: "button", id: "btnSave", disabled: true, onclick: saveChart },
            "Save"
        );

        // Load
        const chartSelect = h("select", {
            class: "sc-select",
            id: "select-chart-names",
            "aria-label": "Select saved chart",
            disabled: true,
            style: { width: "8.125rem" },
            onchange: () => update(),
        });
        const renderSavedCharts = (selected = "") => {
            const names = Object.keys(savedCharts);
            chartSelect.replaceChildren(
                h("option", { value: "", disabled: true }, names.length > 0 ? "Saved charts" : "No saved charts"),
                ...names.map((chartName) => h("option", { value: chartName }, chartName))
            );
            chartSelect.value = selected;
        };
        const loadButton = h(
            "button",
            {
                class: "sc-button sc-button-outline",
                type: "button",
                id: "btnLoad",
                disabled: true,
                onclick: () => {
                    const definition = savedCharts[chartSelect.value];
                    if (!controls || !definition) return;
                    nameInput.value = chartSelect.value;
                    controls.resetChart();
                    controls.applyDefinition(definition);
                    update();
                },
            },
            "Load"
        );
        const resetButton = h(
            "button",
            {
                class: "sc-button sc-button-icon sc-button-danger",
                type: "button",
                id: "btnReset",
                "aria-label": "Refresh chart",
                title: "Clear annotations and reset zoom",
                disabled: true,
                onclick: () => controls?.resetChart(),
            },
            RefreshIcon()
        );

        /** Enable/disable the controls and update their hints for the current state. */
        const update = () => {
            const isReady = !!controls;
            const hasName = !!nameInput.value.trim();
            const hasSelection = !!savedCharts[chartSelect.value];
            modeButtons.forEach((button) => (button.disabled = !isReady));
            nameInput.disabled = resetButton.disabled = !isReady;
            saveButton.disabled = !isReady || !hasName;
            saveButton.title = hasName ? "Save chart with this name" : "Enter a chart name to save";
            chartSelect.disabled = !isReady || Object.keys(savedCharts).length === 0;
            loadButton.disabled = !isReady || !hasSelection;
            loadButton.title = hasSelection ? "Load selected chart" : "Select a saved chart to load";
        };
        renderSavedCharts();
        update();

        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row justify-start" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Chart mode" },
                    ...modeButtons.values()
                ),
                h(
                    "div",
                    { class: "flex items-center gap-2 ml-auto", role: "group", "aria-label": "Save chart" },
                    nameInput,
                    saveButton
                ),
                h(
                    "div",
                    { class: "flex items-center gap-2", role: "group", "aria-label": "Load chart" },
                    chartSelect,
                    loadButton
                ),
                resetButton
            ),
            chartHost
        );

        ({ controls } = await demo.mount(drawExample, chartHost));
        update();
    });
