import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");
        const host = h("div");
        const rows = h("div", { class: "flex-1 overflow-y-auto" });
        root.append(
            host,
            h(
                "aside",
                { class: "sc-responsive-controls" },
                h("h3", { class: "text-center" }, "Selected Points"),
                h(
                    "div",
                    { class: "flex border-b border-t" },
                    h("div", { class: "flex w-full text-center px-2 border-r" }, "Name"),
                    h("div", { class: "flex w-full text-center px-2 border-r" }, "X Value"),
                    h("div", { class: "flex w-full text-center px-2" }, "Y Value")
                ),
                rows
            )
        );
        await demo.mount(
            (el) =>
                drawExample(el, (points) =>
                    rows.replaceChildren(
                        ...points.map((dp) =>
                            h(
                                "div",
                                { class: "flex border-b" },
                                h("div", { class: "flex w-full text-center px-2 border-r" }, dp.seriesName),
                                h("div", { class: "flex w-full text-center px-2 border-r" }, dp.xValue.toFixed(0)),
                                h("div", { class: "flex w-full text-center px-2" }, dp.yValue.toFixed(2))
                            )
                        )
                    )
                ),
            host
        );
    });
