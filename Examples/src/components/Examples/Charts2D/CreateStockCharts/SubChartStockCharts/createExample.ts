import { Demo, h } from "../../../demoHelpers";
import {
    drawExample,
    containerId2,
    subChartWrapper1,
    subChartWrapper2,
    subChartWrapper3,
    dividerId1,
    dividerId2,
} from "./drawExample";

/** A draggable horizontal divider between two sub-chart panes. */
const divider = (id: string) =>
    h(
        "div",
        {
            id,
            class: "w-full absolute",
            style: { height: "0.125rem", backgroundColor: "var(--border-color)", cursor: "row-resize", zIndex: "1" },
        },
        h("div", { class: "w-full", style: { height: "0.25rem", borderBottom: "2px dashed" } })
    );

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.id = containerId2;
        const chartHost = h("div", {
            class: "w-full h-full",
            style: { minWidth: "100%", maxWidth: "100%", minHeight: "100%", maxHeight: "100%" },
        });
        root.append(
            h("div", { id: subChartWrapper1, class: "absolute" }),
            divider(dividerId1),
            h("div", { id: subChartWrapper2, class: "absolute" }),
            divider(dividerId2),
            h("div", { id: subChartWrapper3, class: "absolute" }),
            chartHost
        );
        await demo.mount(drawExample, chartHost);
    });
