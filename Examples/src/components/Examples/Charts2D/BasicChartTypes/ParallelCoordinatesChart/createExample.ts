import { Demo, element, h } from "../../../demoHelpers";
import {
    drawMultiSeriesExample,
    drawSingleSeriesExample,
    MULTI_SERIES_RECORD_COUNT,
    SINGLE_SERIES_RECORD_COUNT,
} from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");
        const host = element("div", root, "min-w-0 h-full");
        const panel = element("aside", root, "sc-responsive-controls");
        let single = false,
            interpolate = false,
            selection = false,
            cursor = false,
            drag = "none";
        let child: Demo;
        type CommonControls = {
            selectionModifier: { isEnabled: boolean };
            cursorModifier: { isEnabled: boolean };
            panModifier: { isEnabled: boolean };
            rubberBandZoomModifier: { isEnabled: boolean };
            axisReorderModifier: { isEnabled: boolean };
            highlightModifier: { isEnabled: boolean };
        };
        let controls: CommonControls;
        const apply = () => {
            if (!controls) return;
            controls.selectionModifier.isEnabled = selection;
            controls.cursorModifier.isEnabled = cursor;
            controls.panModifier.isEnabled = drag === "pan";
            controls.rubberBandZoomModifier.isEnabled = drag === "zoom";
            controls.axisReorderModifier.isEnabled = drag === "reorder";
            controls.highlightModifier.isEnabled = drag === "highlight";
        };
        const initialize = () => {
            child?.dispose();
            controls = undefined;
            child = new Demo(host, async (chart) => {
                if (single) {
                    const result = await chart.chart((root) => drawSingleSeriesExample(root, interpolate));
                    controls = { ...result, selectionModifier: result.recordSelectionModifier };
                } else {
                    const result = await chart.chart((root) => drawMultiSeriesExample(root, interpolate));
                    controls = { ...result, selectionModifier: result.seriesSelectionModifier };
                }
                apply();
            });
        };
        const modes = [
            {
                single: false,
                label: `Multi-Series (${MULTI_SERIES_RECORD_COUNT.toLocaleString("en-US")} records)`,
                selectionLabel: "Series selection (hover)",
            },
            {
                single: true,
                label: `Single-Series (${(SINGLE_SERIES_RECORD_COUNT / 1000).toLocaleString("en-US")}K records)`,
                selectionLabel: "Record selection (click)",
            },
        ];
        const modeButtons = modes.map((mode) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button sc-button-outline justify-start",
                    "aria-pressed": String(mode.single === single),
                    title: mode.label,
                    onclick: () => {
                        if (single === mode.single) return;
                        single = mode.single;
                        modeButtons.forEach((node, index) =>
                            node.setAttribute("aria-pressed", String(modes[index].single === single))
                        );
                        selectionLabel.textContent = mode.selectionLabel;
                        initialize();
                    },
                },
                mode.label
            )
        );

        const checkboxRow = (label: string, change: (checked: boolean) => void) => {
            const input = h("input", {
                class: "sc-checkbox",
                type: "checkbox",
                onchange: () => change(input.checked),
            });
            const text = h("span", {}, label);
            return { input, text, row: h("label", { class: "sc-control" }, input, text) };
        };
        const interpolateRow = checkboxRow("Spline interpolation", (checked) => {
            interpolate = checked;
            initialize();
        });
        const selectionRow = checkboxRow(modes[0].selectionLabel, (checked) => {
            selection = checked;
            apply();
        });
        const selectionLabel = selectionRow.text;
        const cursorRow = checkboxRow("Cursor tooltip", (checked) => {
            cursor = checked;
            apply();
        });
        // Pan / rubber-band / reorder / range-highlight all use the left-drag gesture, so at most one may be active.
        const tools = [
            ["Pan", "pan"],
            ["Rubber-band zoom", "zoom"],
            ["Reorder axes (drag 1 at a time)", "reorder"],
            ["Range highlight (over a Y axis)", "highlight"],
        ];
        const toolRows = tools.map(([label, tool]) =>
            checkboxRow(label, (checked) => {
                drag = checked ? tool : "none";
                toolRows.forEach((row, index) => (row.input.checked = drag === tools[index][1]));
                apply();
            })
        );

        panel.append(
            h("h2", { class: "px-2" }, "Variant:"),
            h("div", { class: "sc-button-group flex-col" }, ...modeButtons),
            h("hr"),
            h("h2", { class: "px-2" }, "Interactions:"),
            h(
                "div",
                { class: "flex flex-col gap-1 px-2" },
                h("h4", {}, "General"),
                interpolateRow.row,
                selectionRow.row,
                cursorRow.row,
                h("hr"),
                h("h4", {}, "Left drag tool"),
                ...toolRows.map((item) => item.row)
            )
        );
        initialize();
        demo.cleanup(() => child.dispose());
        await child.ready;
    });
