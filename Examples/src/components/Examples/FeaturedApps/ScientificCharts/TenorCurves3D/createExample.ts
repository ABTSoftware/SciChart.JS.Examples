import { Demo, element } from "../../../demoHelpers";
import { draw3DChart, drawLineChart1, drawLineChart2, drawHeatmapLegend } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-wrap");
        const left = element("div", root, "relative");
        Object.assign(left.style, { minWidth: "12.5rem", flex: "1 1 50%" });
        const right = element("div", root, "relative");
        right.style.flex = "1 1 50%";
        const top = element("div", right);
        top.style.height = "50%";
        const bottom = element("div", right);
        bottom.style.height = "50%";
        await Promise.all([
            demo.chart(draw3DChart, left),
            demo.chart(drawHeatmapLegend, left, "sc-color-legend"),
            demo.chart(drawLineChart1, top),
            demo.chart(drawLineChart2, bottom),
        ]);
    });
