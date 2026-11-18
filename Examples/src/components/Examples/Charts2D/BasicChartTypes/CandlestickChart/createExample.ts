import { SciChartOverview } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, overviewOptions } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let preset = 0;
        let chart: Awaited<ReturnType<ReturnType<typeof drawExample>>> | undefined;
        let disposeChart: (() => void) | undefined;

        // Toggle visibility of candlestick or OHLC series
        const applyPreset = () => {
            presetButtons.forEach((button, index) => button.setAttribute("aria-pressed", String(preset === index)));
            if (!chart) return;
            chart.candlestickSeries.isVisible = preset === 0;
            chart.ohlcSeries.isVisible = preset === 1;
        };
        const presetButtons = ["Candlestick Series", "OHLC Series"].map((label, index) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(preset === index),
                    onclick: () => {
                        preset = index;
                        applyPreset();
                    },
                },
                label
            )
        );
        const dataSourceSelect: HTMLSelectElement = h(
            "select",
            {
                class: "sc-select",
                id: "data-source-select",
                value: "Random",
                onchange: (): void => void initChart(dataSourceSelect.value).catch(console.error),
            },
            h("option", { value: "Random" }, "Random"),
            h("option", { value: "com" }, "Binance.com"),
            h("option", { value: "us" }, "Binance.us")
        );
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("div", { class: "sc-button-group", role: "group", "aria-label": "Series type" }, ...presetButtons),
                h("label", { class: "sc-control", for: "data-source-select" }, "Data Source", dataSourceSelect)
            )
        );

        // The chart and its overview are recreated whenever the data source changes
        const initChart = async (dataSource: string) => {
            disposeChart?.();
            chart = undefined;
            const chartHost = h("div", { style: { width: "100%", height: "100%" } });
            const overviewHost = h("div", { class: "sc-overview" });
            const container = h(
                "div",
                { class: "sc-overview-chart", style: { position: "relative" } },
                chartHost,
                overviewHost
            );
            root.append(container);

            let disposed = false;
            const disposers: (() => void)[] = [() => container.remove()];
            disposeChart = () => {
                disposed = true;
                disposers.reverse().forEach((disposer) => disposer());
                disposers.length = 0;
            };

            const result = await drawExample(dataSource)(chartHost);
            if (disposed) return result.sciChartSurface.delete();
            disposers.push(() => result.sciChartSurface.delete());
            const overview = await SciChartOverview.create(result.sciChartSurface, overviewHost, overviewOptions);
            if (disposed) return overview.delete();
            disposers.push(() => overview.delete());
            chart = result;
            applyPreset();
        };
        demo.cleanup(() => disposeChart?.());
        await initChart("Random");
    });
