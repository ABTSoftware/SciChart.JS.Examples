import { EMultiLineAlignment, ETextAlignment, ETitlePosition } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;

        // The settings only take effect once the chart is ready; until then a change is reverted.
        const text = h(
            "textarea",
            {
                class: "sc-input w-full",
                rows: 3,
                style: { minHeight: "5.5rem" },
                oninput: () => {
                    if (controls) controls.updateTitleText(text.value);
                    else text.value = text.defaultValue;
                },
            },
            "Multiline\nChart Title"
        );
        const placeWithinChart = h("input", {
            type: "checkbox",
            onchange: () => {
                if (controls) controls.updateTitlePlaceWithinChart(placeWithinChart.checked);
                else placeWithinChart.checked = false;
            },
        });
        const enumSelect = <T extends string>(label: string, values: T[], initial: T, change: (value: T) => void) => {
            const node = h(
                "select",
                {
                    class: "sc-select",
                    style: { width: "6.5rem" },
                    value: initial,
                    onchange: () => {
                        if (controls) change(node.value as T);
                        else node.value = initial;
                    },
                },
                ...values.map((value) => h("option", { value }, value))
            );
            return h("label", { class: "sc-control justify-between" }, h("span", { class: "flex-none" }, label), node);
        };
        const fontSizeValue = document.createTextNode("70");
        const fontSizeLabel = h("span", { class: "flex-none", style: { width: "2.25rem" } }, fontSizeValue, "px");
        const fontSize = h("input", {
            class: "sc-range flex-1 min-w-0",
            "aria-label": "Font size",
            type: "range",
            min: 12,
            max: 100,
            step: 1,
            value: "70",
            oninput: () => {
                fontSizeValue.data = fontSize.value;
                controls?.updateTitleFontSize(fontSize.valueAsNumber);
            },
        });
        const color = h("input", {
            class: "sc-input",
            type: "color",
            value: appTheme.ForegroundColor.slice(0, 7),
            oninput: () => controls?.updateTitleColor(color.value),
        });

        const chartHost = h("div");
        root.append(
            chartHost,
            h(
                "aside",
                { class: "sc-responsive-controls", "aria-label": "Title settings" },
                h("h2", {}, "Title settings:"),
                h("label", { class: "sc-control flex-col items-start" }, "Title text", text),
                h("label", { class: "sc-switch justify-between" }, "Place inside chart", placeWithinChart),
                h("hr"),
                enumSelect("Position", Object.values(ETitlePosition), ETitlePosition.Top, (value) =>
                    controls?.updateTitlePosition(value)
                ),
                enumSelect("Alignment", Object.values(ETextAlignment), ETextAlignment.Center, (value) =>
                    controls?.updateTitleAlignment(value)
                ),
                enumSelect(
                    "Multiline alignment",
                    Object.values(EMultiLineAlignment),
                    EMultiLineAlignment.Center,
                    (value) => controls?.updateTitleMultilineAlignment(value)
                ),
                h("hr"),
                h(
                    "label",
                    { class: "sc-control" },
                    h("span", { class: "flex-none" }, "Font size"),
                    fontSize,
                    fontSizeLabel
                ),
                h("label", { class: "sc-control justify-between" }, "Color", color)
            )
        );

        controls = (await demo.mount(drawExample, chartHost)).controls;
    });
