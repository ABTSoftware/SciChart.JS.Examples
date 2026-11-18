import { Demo, h } from "../../../demoHelpers";
import { drawExample, SubChartConfig, SubChartManager } from "./drawExample";
import { appTheme } from "../../../theme";
const colors = [
    appTheme.MutedBlue,
    appTheme.MutedOrange,
    appTheme.MutedPink,
    appTheme.MutedPurple,
    appTheme.MutedRed,
    appTheme.MutedSkyBlue,
    appTheme.MutedTeal,
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");
        let configs: SubChartConfig[] = [0, 1, 2, 3].map((index) => ({
            id: `subchart-${index}`,
            phase: index * 0.7,
            color: colors[index],
            title: `Pane ${index + 1}`,
        }));
        let manager: SubChartManager | undefined;
        let nextId = 4;

        const colorsPanel = h("div", { class: "flex flex-wrap items-center gap-2" });
        const removeButton = h(
            "button",
            {
                class: "sc-button sc-button-danger",
                type: "button",
                title: "Remove Last SubChart",
                onclick: () => {
                    configs = configs.slice(0, -1);
                    refresh();
                },
            },
            "Remove Chart"
        );
        const addButton = h(
            "button",
            {
                class: "sc-button ml-auto",
                type: "button",
                title: "Add SubChart",
                onclick: () => {
                    const index = configs.length;
                    configs.push({
                        id: `subchart-${Date.now()}-${nextId++}`,
                        phase: Math.random() * 3,
                        color: colors[index % colors.length],
                        title: `Pane ${index + 1}`,
                    });
                    refresh();
                },
            },
            "Add Chart"
        );
        const host = h("div", { class: "w-full h-full" });

        const refresh = () => {
            colorsPanel.replaceChildren(
                ...configs.map((config) =>
                    h("input", {
                        type: "color",
                        value: config.color,
                        class: "sc-input",
                        "aria-label": `Change color for ${config.title}`,
                        title: `Change color for ${config.title}`,
                        oninput: (e: Event) => {
                            config.color = (e.target as HTMLInputElement).value;
                            manager?.updateSubCharts(configs);
                        },
                    })
                )
            );
            removeButton.disabled = configs.length === 0;
            manager?.updateSubCharts(configs);
        };
        refresh();

        root.append(h("header", { class: "sc-toolbar-row" }, colorsPanel, addButton, removeButton), host);
        manager = (await demo.mount((el) => drawExample(el, configs), host)).manager;
    });
