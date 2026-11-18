import { Demo, h } from "../../../demoHelpers";
import { drawExample, overviewOptions } from "./drawExample";
import { SciChartOverview } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const chartHost = h("div", { style: { height: "100%", width: "100%" } });
        const overviewHost = h("div", { style: { height: "100%", width: "100%" } });
        root.append(
            h(
                "div",
                { class: "sc-overview-chart", style: { position: "relative" } },
                chartHost,
                h("div", { class: "sc-overview", style: { position: "relative" } }, overviewHost)
            )
        );
        const { sciChartSurface } = await demo.mount(drawExample, chartHost);
        const overview = await SciChartOverview.create(sciChartSurface, overviewHost, overviewOptions);
        demo.cleanup(() => overview.delete());
    });
