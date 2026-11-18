import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { TDatasetId } from "./createDatasets";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;

        const zoomToggle = h("input", {
            type: "checkbox",
            checked: false,
            onchange: () => {
                if (zoomToggle.checked) controls?.zoomInPrecise();
                else controls?.zoomOut();
            },
        });
        const datasetSelect = h(
            "select",
            {
                class: "sc-select",
                id: "precision-dataset",
                value: "nanosecondPrecision",
                onchange: () => {
                    controls?.useDataset(datasetSelect.value as TDatasetId);
                    zoomToggle.checked = false;
                },
            },
            h("option", { value: "secondPrecision" }, "Precision: 1 Second / Range: 1 BILLION Years"),
            h("option", { value: "millisecondPrecision" }, "Precision: 1 Millisecond / Range: 70000 Years"),
            h("option", { value: "microsecondPrecision" }, "Precision: 1 Microsecond / Range: 40 Years"),
            h("option", { value: "nanosecondPrecision" }, "Precision: 1 Nanosecond / Range: 50 Days")
        );

        const host = h("div");
        root.append(
            host,
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("label", { class: "sc-control", htmlFor: "precision-dataset" }, "Dataset", datasetSelect),
                h("label", { class: "sc-switch" }, zoomToggle, "Precise Zoom In")
            )
        );
        controls = (await demo.mount(drawExample, host)).controls;
    });
