import { Demo, h } from "../../../demoHelpers";
import { getChartsInitializationAPI } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const api = getChartsInitializationAPI();
        // The panel hosting the price chart
        const priceHost = h("div", { style: { flex: "1 1 25rem" } });
        // Panels hosting the Macd and RSI Indicator charts
        const macdHost = h("div", { style: { flex: "1 1 6.25rem" } });
        const rsiHost = h("div", { style: { flex: "1 1 6.25rem" } });
        // Panel hosting the overview control
        const overviewHost = h("div", { class: "w-full h-full" });
        root.append(
            h(
                "div",
                { class: "flex flex-col h-full" },
                priceHost,
                macdHost,
                rsiHost,
                h("div", { style: { flexBasis: "4.375rem" } }, overviewHost)
            )
        );
        const [{ sciChartSurface }] = await Promise.all([
            demo.mount(api.drawPriceChart, priceHost),
            demo.mount(api.drawMacdChart, macdHost),
            demo.mount(api.drawRsiChart, rsiHost),
        ]);
        await demo.mount(api.drawOverview(sciChartSurface), overviewHost);
        api.configureAfterInit();
    });
