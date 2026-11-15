import { Demo, h } from "../../../demoHelpers";
import { drawExample, EColumn3DType, EColumnColorMode } from "./drawExample";
import { ColumnRenderableSeries3D } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;

        const shapeSelect = h(
            "select",
            {
                class: "sc-select",
                value: EColumn3DType.CylinderPointMarker3D,
                onchange: () => chart?.controls.updatePointMarker(shapeSelect.value as EColumn3DType),
            },
            ...Object.values(EColumn3DType).map((type) => h("option", { value: type }, type))
        );
        const colorSelect = h(
            "select",
            {
                class: "sc-select",
                value: EColumnColorMode.X,
                onchange: () => chart?.controls.updateColors(colorSelect.value as EColumnColorMode),
            },
            ...Object.values(EColumnColorMode).map((mode) => h("option", { value: mode }, mode))
        );
        const widthLabel = h("span", {}, "Data-point width: ", "1.00");
        const widthRange = h("input", {
            type: "range",
            class: "sc-range -mt-1",
            id: "seriesCount",
            step: "0.05",
            min: "0",
            max: "1",
            value: "1",
            oninput: () => {
                const width = widthRange.valueAsNumber;
                widthLabel.replaceChildren("Data-point width: ", width.toFixed(2));
                const series = chart?.sciChartSurface.renderableSeries.get(0) as ColumnRenderableSeries3D;
                if (!series) return;
                series.dataPointWidthX = width;
                series.dataPointWidthZ = width;
            },
        });

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("label", { class: "sc-control" }, "Column Shape", shapeSelect),
                h("label", { class: "sc-control" }, "Color Mode", colorSelect),
                h("label", { class: "sc-control flex flex-col gap-0" }, widthLabel, widthRange)
            )
        );
        chart = await demo.chart(drawExample);
    });
