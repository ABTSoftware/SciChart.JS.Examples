import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const { controls } = await demo.chart(drawExample);
        choices(
            toolbar,
            "Style animation",
            [
                { label: "Animation Style 1", value: true },
                { label: "Animation Style 2", value: false },
            ],
            true,
            controls.animateChartStyle
        );
    });
