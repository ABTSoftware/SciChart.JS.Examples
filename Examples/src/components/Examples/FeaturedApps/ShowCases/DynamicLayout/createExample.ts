import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;

        const setIsGrid = (isGrid: boolean) => {
            chart.setIsGridLayoutMode(isGrid);
            gridButton.setAttribute("aria-pressed", String(isGrid));
            singleButton.setAttribute("aria-pressed", String(!isGrid));
        };
        // The layout buttons stay disabled until the chart is ready
        const gridButton = h(
            "button",
            {
                type: "button",
                class: "sc-button",
                "aria-pressed": "true",
                disabled: true,
                onclick: () => setIsGrid(true),
            },
            "Chart Per Series"
        );
        const singleButton = h(
            "button",
            {
                type: "button",
                class: "sc-button",
                "aria-pressed": "false",
                disabled: true,
                onclick: () => setIsGrid(false),
            },
            "Single Chart"
        );
        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Chart layout" },
                    gridButton,
                    singleButton
                )
            ),
            chartHost
        );

        chart = await demo.mount(drawExample, chartHost);
        gridButton.disabled = singleButton.disabled = false;
    });
