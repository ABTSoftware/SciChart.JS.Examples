import { Demo, h } from "../../../demoHelpers";
import { drawExample, drawHeatmapLegend, sciChartOverview } from "./drawExample";
import { SciChartOverview } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");

        // Main chart with the overview nested below it
        const chartHost = h("div", { style: { height: "100%", width: "100%", flex: "1 1 90%", minHeight: "0" } });
        const overviewHost = h("div", { style: { height: "100%", width: "100%" } });
        const chartWrapper = h(
            "div",
            { class: "flex flex-col w-full flex-auto", style: { position: "relative" } },
            chartHost,
            h("div", { style: { position: "relative", flex: "1 1 10%" } }, overviewHost)
        );

        // Heatmap colour legend
        const legendHost = h("div", { style: { height: "100%", width: "100%" } });
        const legendWrapper = h(
            "div",
            { class: "absolute top-0 left-0", style: { position: "relative", height: "90%", width: "4.0625rem" } },
            legendHost
        );

        root.append(chartWrapper, legendWrapper);
        const [{ sciChartSurface }] = await Promise.all([
            demo.mount(drawExample, chartHost),
            demo.mount(drawHeatmapLegend, legendHost),
        ]);
        const overview = await SciChartOverview.create(sciChartSurface, overviewHost, sciChartOverview);
        demo.cleanup(() => overview.delete());
    });
