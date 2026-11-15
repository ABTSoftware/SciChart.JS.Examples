import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;

        const percentageInput = h("input", {
            type: "checkbox",
            onchange: () => {
                if (!chart) {
                    percentageInput.checked = false;
                    return;
                }
                console.log(`100% stacked? ${percentageInput.checked}`);
                // Toggle 100% mode on click
                chart.stackedMountainCollection.isOneHundredPercent = percentageInput.checked;
                chart.sciChartSurface.zoomExtents(200);
            },
        });

        const chartHost = h("div");
        root.append(
            h("header", { class: "sc-toolbar-row" }, h("label", { class: "sc-switch" }, percentageInput, "100% Mode")),
            chartHost
        );

        chart = await demo.mount(drawExample, chartHost);
    });
