import { ELegendOrientation, ELegendPlacement, SciChartLegend } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

const placementSelect = [
    { value: ELegendPlacement.TopLeft, text: "Top-Left" },
    { value: ELegendPlacement.TopRight, text: "Top-Right" },
    { value: ELegendPlacement.BottomLeft, text: "Bottom-Left" },
    { value: ELegendPlacement.BottomRight, text: "Bottom-Right" },
];

const orientationSelect = [
    { value: ELegendOrientation.Vertical, text: "Vertical" },
    { value: ELegendOrientation.Horizontal, text: "Horizontal" },
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");
        let legend: SciChartLegend | undefined;

        // Applies a control to the legend. Changes made before the chart is ready are reverted.
        const bind = <T extends HTMLInputElement | HTMLSelectElement>(
            node: T,
            apply: (legend: SciChartLegend, node: T) => void
        ) => {
            const isCheckbox = node instanceof HTMLInputElement && node.type === "checkbox";
            let checked = isCheckbox && node.checked;
            let value = node.value;
            node.addEventListener("input", () => {
                if (!legend) {
                    if (isCheckbox) node.checked = checked;
                    else node.value = value;
                    return;
                }
                checked = isCheckbox && node.checked;
                value = node.value;
                apply(legend, node);
            });
            return node;
        };

        const showLegend = bind(
            h("input", { type: "checkbox", checked: true }),
            (legend, node) => (legend.showLegend = node.checked)
        );
        const showCheckboxes = bind(
            h("input", { type: "checkbox", checked: true }),
            (legend, node) => (legend.showCheckboxes = node.checked)
        );
        const showSeriesMarkers = bind(
            h("input", { type: "checkbox", checked: true }),
            (legend, node) => (legend.showSeriesMarkers = node.checked)
        );
        const placement = bind(
            h(
                "select",
                { id: "sciChartPlacement", class: "sc-select", value: ELegendPlacement.TopLeft },
                ...placementSelect.map((option) => h("option", { value: option.value }, option.text))
            ),
            (legend, node) => (legend.placement = node.value as ELegendPlacement)
        );
        const orientation = bind(
            h(
                "select",
                { id: "sciChartOrientation", class: "sc-select", value: ELegendOrientation.Vertical },
                ...orientationSelect.map((option) => h("option", { value: option.value }, option.text))
            ),
            (legend, node) => (legend.orientation = node.value as ELegendOrientation)
        );
        const backgroundColor = bind(
            h("input", {
                type: "color",
                class: "sc-input",
                value: appTheme.SciChartJsTheme.legendBackgroundBrush.slice(0, 7),
            }),
            (legend, node) => (legend.backgroundColor = node.value)
        );
        const textColor = bind(
            h("input", {
                type: "color",
                class: "sc-input",
                value: appTheme.SciChartJsTheme.labelForegroundBrush.slice(0, 7),
            }),
            (legend, node) => (legend.textColor = node.value)
        );
        const marginText = document.createTextNode("10");
        const margin = bind(
            h("input", { type: "range", class: "sc-range flex-1", min: 0, max: 50, step: 1, value: "10" }),
            (legend, node) => {
                marginText.data = node.value;
                legend.margin = node.valueAsNumber;
            }
        );

        const chartHost = h("div");
        root.append(
            chartHost,
            h(
                "aside",
                { class: "sc-responsive-controls", "aria-label": "Legend settings" },
                h("h2", {}, "Legend settings"),
                h("label", { class: "sc-switch" }, showLegend, "Show legend"),
                h("label", { class: "sc-switch" }, showCheckboxes, "Visibility checkboxes"),
                h("label", { class: "sc-switch" }, showSeriesMarkers, "Series markers"),
                h("hr"),
                h(
                    "label",
                    { class: "sc-control justify-between", htmlFor: "sciChartPlacement" },
                    h("span", { class: "flex-none" }, "Placement"),
                    placement
                ),
                h(
                    "label",
                    { class: "sc-control justify-between", htmlFor: "sciChartOrientation" },
                    h("span", { class: "flex-none" }, "Orientation"),
                    orientation
                ),
                h("hr"),
                h("label", { class: "sc-control justify-between" }, "Background color", backgroundColor),
                h("label", { class: "sc-control justify-between" }, "Text color", textColor),
                h(
                    "label",
                    { class: "sc-control" },
                    h("span", { class: "flex-none" }, "Margin: ", marginText, "px"),
                    margin
                )
            )
        );

        const { legendModifier } = await demo.mount(drawExample, chartHost);
        legend = legendModifier.sciChartLegend;
        backgroundColor.value = (legend.backgroundColor ?? appTheme.SciChartJsTheme.legendBackgroundBrush).slice(0, 7);
        textColor.value = (legend.textColor ?? appTheme.SciChartJsTheme.labelForegroundBrush).slice(0, 7);
        margin.value = marginText.data = String(legend.margin);
    });
