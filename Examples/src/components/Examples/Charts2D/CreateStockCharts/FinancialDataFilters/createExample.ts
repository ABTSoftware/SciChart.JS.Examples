import { Demo, h } from "../../../demoHelpers";
import { drawExample, TFilterMode } from "./drawExample";

const FILTER_LABELS: Array<{ mode: TFilterMode; label: string }> = [
    { mode: "source", label: "Default (no filter)" },
    { mode: "heikinAshi", label: "Heikin-Ashi" },
    { mode: "renko", label: "Renko" },
    { mode: "pointAndFigure", label: "Point & Figure" },
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chartApi: Awaited<ReturnType<typeof drawExample>> | undefined;
        let filterMode: TFilterMode = "source";

        const buttons = FILTER_LABELS.map(({ mode, label }) =>
            h(
                "button",
                {
                    class: "sc-button",
                    type: "button",
                    "aria-pressed": String(filterMode === mode),
                    onclick: () => {
                        filterMode = mode;
                        buttons.forEach((button, index) =>
                            button.setAttribute("aria-pressed", String(FILTER_LABELS[index].mode === mode))
                        );
                        chartApi?.setFilterMode(mode);
                    },
                },
                label
            )
        );
        const chartHost = h("div", { class: "w-full h-full" });
        root.append(
            h("header", { class: "sc-toolbar-row" }, h("div", { class: "sc-button-group", role: "group" }, ...buttons)),
            chartHost
        );

        chartApi = await demo.mount(drawExample, chartHost);
        chartApi.setFilterMode(filterMode);
    });
