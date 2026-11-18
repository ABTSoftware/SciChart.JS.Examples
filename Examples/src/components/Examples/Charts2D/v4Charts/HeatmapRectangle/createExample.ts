import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const { setChart } = await demo.chart(drawExample);
        choices(
            toolbar,
            "Heatmap colors",
            [
                { label: "Gradient colors", value: true },
                { label: "Solid colors", value: false },
            ],
            true,
            setChart
        );
    });
