import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const chartHost = h("div");
        root.append(chartHost);
        const { controls } = await demo.mount(drawExample, chartHost);

        // The header is shown once the chart is ready.
        const useDateFns = h("input", {
            type: "checkbox",
            checked: true,
            onchange: () => controls.setUseDateFns(useDateFns.checked),
        });
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("label", { class: "sc-switch" }, useDateFns, 'Use "date-fns" formatting for X-Axis')
            )
        );
    });
