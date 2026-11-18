import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const host = element("div", root, "relative flex-1");
        let chart: Demo;
        const initialize = (usePercentage: boolean) => {
            chart?.dispose();
            chart = new Demo(host, async (child) => {
                await child.chart((element) => drawExample(element, usePercentage));
            });
        };
        choices(
            toolbar,
            "Data display mode",
            [
                { label: "Percentage Change", value: true },
                { label: "Original Data", value: false },
            ],
            true,
            initialize
        );
        initialize(true);
        demo.cleanup(() => chart.dispose());
        await chart.ready;
    });
