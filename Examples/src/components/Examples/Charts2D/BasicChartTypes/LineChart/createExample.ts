import { Demo } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-chart-grid");
        const api = getChartsInitializationAPI();
        await Promise.all(
            [
                api.initJustLineCharts,
                api.initDigitalLineCharts,
                api.initTooltipsOnLineCharts,
                api.initDashedLineCharts,
                api.initPalettedLineCharts,
                api.initHoveredLineCharts,
                api.initGapsInLineCharts,
                api.initVerticalLineCharts,
                api.initThresholdedLineCharts,
            ].map((init) => demo.chart(init, root, ""))
        );
    });
