import { TextLabelProvider } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

const presets = [
    { label: "Multi-Line", rotation: 0, maxLength: 9 },
    { label: "Single Line Rotated", rotation: 20, maxLength: 0 },
    { label: "Multi-Line Rotated", rotation: 30, maxLength: 15 },
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let labelProvider: TextLabelProvider | undefined;

        const handlePreset = (value: number) => {
            buttons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === value)));
            if (!labelProvider) return;
            labelProvider.rotation = presets[value].rotation;
            labelProvider.maxLength = presets[value].maxLength;
        };

        const buttons = presets.map(({ label }, index) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(index === 2),
                    onclick: () => handlePreset(index),
                },
                label
            )
        );
        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("div", { class: "sc-button-group", role: "group", "aria-label": "Label layout" }, ...buttons)
            ),
            chartHost
        );

        ({ labelProvider } = await demo.mount(drawExample, chartHost));
    });
