import { EColumnDataLabelPosition } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;

        const hundredPercent = h("input", {
            type: "checkbox",
            onchange: () => {
                // 100% mode can only be switched once the chart is ready
                if (controls) controls.toggleHundredPercentMode(hundredPercent.checked);
                else hundredPercent.checked = false;
            },
        });
        const position = h(
            "select",
            {
                class: "sc-select",
                value: EColumnDataLabelPosition.Center,
                onchange: () => controls?.setDataLabelPosition(position.value as EColumnDataLabelPosition),
            },
            ...Object.values(EColumnDataLabelPosition)
                .filter((p) => p !== EColumnDataLabelPosition.Position)
                .map((value) => h("option", { value }, value))
        );
        const showLabels = h("input", {
            type: "checkbox",
            checked: true,
            onchange: () => {
                position.disabled = !showLabels.checked;
                controls?.toggleDataLabels(showLabels.checked);
            },
        });

        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("label", { class: "sc-switch" }, hundredPercent, h("span", {}, "100% Mode")),
                h("label", { class: "sc-control" }, h("span", {}, "Label position"), position),
                h("label", { class: "sc-switch" }, showLabels, "Show Labels")
            ),
            chartHost
        );

        controls = (await demo.mount(drawExample, chartHost)).controls;
    });
